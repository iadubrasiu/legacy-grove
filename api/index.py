import sqlite3
from flask import Flask, request, redirect, url_for, g, render_template_string

app = Flask(__name__)

# --- CONFIGURACIÓN ---
DATABASE = ':memory:'
SCHEMA = "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, name TEXT, birth_date TEXT);"

# --- BASE DE DATOS ---
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
        db.cursor().execute(SCHEMA)
        # Datos iniciales siempre que arranca (Serverless friendly)
        db.execute("INSERT OR IGNORE INTO people (id, name, birth_date) VALUES (1, 'Abuelo Juan', '1930-01-01')")
        db.commit()
    return db

@app.teardown_appcontext
def close(e):
    db = getattr(g, '_database', None)
    if db: db.close()

# --- HTML TEMPLATES ---
LAYOUT = """<!doctype html>
<html><head><title>LegacyGrove</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#f4f4f9;color:#333}
nav{background:#2c3e50;padding:15px;border-radius:8px;margin-bottom:30px;display:flex;gap:20px}
nav a{color:#fff;text-decoration:none;font-weight:600}
nav a:hover{text-decoration:underline}
.card{background:#fff;padding:20px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border:1px solid #eaeaea}
h1{color:#2c3e50;margin-top:0}
button{background:#0070f3;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;font-size:16px;font-weight:500}
button:hover{background:#0051a2}
input{padding:10px;border:1px solid #ccc;border-radius:5px;width:100%;box-sizing:border-box;margin-top:5px}
label{display:block;margin-bottom:15px;font-weight:500}
ul{list-style:none;padding:0}
li{padding:10px;border-bottom:1px solid #eee;display:flex;justify-content:space-between}
li:last-child{border-bottom:none}
</style></head>
<body>
<nav><a href='/'>🏠 Inicio</a> <a href='/add'>➕ Añadir Recuerdo</a> <a href='/genealogy'>🌳 Árbol</a></nav>
<main>{% block content %}{% endblock %}</main>
</body></html>"""

IDX = "{% extends 'B' %}{% block content %}<h1>Bienvenido a LegacyGrove</h1><div class='card'><h2>Tus Recuerdos Familiares</h2><p>Una aplicación segura para preservar la historia de tu familia.</p></div><h2>Familiares Recientes</h2><div class='card'><ul>{% for p in people %}<li><span><strong>{{p['name']}}</strong></span> <span>{{p['birth_date']}}</span></li>{% else %}<li>No hay datos aún.</li>{% endfor %}</ul></div>{% endblock %}"
ADD = "{% extends 'B' %}{% block content %}<h1>Añadir Familiar</h1><div class='card'><form method='post'><label>Nombre Completo<input name='name' required placeholder='Ej. Tía Luisa'></label><label>Fecha de Nacimiento<input type='date' name='birth_date'></label><button type='submit'>Guardar Familiar</button></form></div>{% endblock %}"
GEN = "{% extends 'B' %}{% block content %}<h1>Árbol Genealógico</h1><div class='card'>{% for p in people %}<div style='padding:10px;border-bottom:1px solid #eee'><h3>👤 {{p['name']}}</h3><p>🎂 Nacido el: {{p['birth_date']}}</p></div>{% else %}<p>Tu árbol está vacío.</p>{% endfor %}</div>{% endblock %}"

def render(template, **kwargs):
    return render_template_string(template.replace("{% extends 'B' %}", LAYOUT), **kwargs)

# --- RUTAS ---
@app.route('/')
def index():
    people = get_db().execute('SELECT * FROM people ORDER BY id DESC LIMIT 5').fetchall()
    return render(IDX, people=people)

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        get_db().execute('INSERT INTO people (name, birth_date) VALUES (?, ?)', 
                        (request.form['name'], request.form['birth_date']))
        get_db().commit()
        return redirect('/genealogy')
    return render(ADD)

@app.route('/genealogy')
def genealogy():
    people = get_db().execute('SELECT * FROM people ORDER BY birth_date').fetchall()
    return render(GEN, people=people)
