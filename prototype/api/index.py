from flask import Flask, request, redirect, url_for, render_template_string
from datetime import datetime

app = Flask(__name__)

# --- BASE DE DATOS VOLÁTIL (RAM) ---
# Simulamos una DB completa.
PEOPLE = [
    {"id": 1, "name": "Abuelo Juan", "role": "El guardián", "img": "https://i.pravatar.cc/150?u=a042581f4e29026024d", "memories": 24},
    {"id": 2, "name": "Tía Marta", "role": "La aventurera", "img": "https://i.pravatar.cc/150?u=a042581f4e29026704d", "memories": 12},
    {"id": 3, "name": "Mamá", "role": "Corazón de familia", "img": "https://i.pravatar.cc/150?u=a042581f4e29026703d", "memories": 45},
]

# El Feed principal
MEMORIES = [
    {"title": "Mi primer día de escuela", "date": "Hace 2 horas", "author": "Abuelo Juan", "desc": "Corría el año 1950...", "img": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=60", "type": "text"},
]

# --- ESTILOS Y SCRIPTS (Mejorados) ---
HEAD = """
<head>
    <title>LegacyGrove</title>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root { --bg: #0f0f0f; --card: #1e1e1e; --accent: #ff9f43; --text: #fff; --text-dim: #a0a0a0; }
        body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; margin:0; display:flex; justify-content:center; min-height:100vh; }
        .app { width:100%; max-width:480px; background:var(--bg); border-left:1px solid #333; border-right:1px solid #333; padding-bottom:80px; position:relative; }
        
        /* Componentes */
        .card { background: var(--card); margin:15px 20px; padding:15px; border-radius:16px; display:flex; gap:15px; align-items:center; }
        .card img { width:80px; height:80px; border-radius:12px; object-fit:cover; }
        .fab { position:fixed; bottom:90px; right:20px; background:var(--accent); width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; color:white; text-decoration:none; box-shadow:0 4px 15px rgba(255,159,67,0.4); z-index:100; }
        .navbar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:#161616; display:flex; justify-content:space-around; padding:15px 0; border-top:1px solid #333; z-index:90; }
        .nav-item { color:var(--text-dim); font-size:1.5rem; }
        .nav-item.active { color:var(--accent); }
        
        /* Avatares */
        .avatars { display:flex; gap:15px; overflow-x:auto; padding:10px 20px; scrollbar-width:none; }
        .av-circle { width:60px; height:60px; border-radius:50%; border:2px solid var(--accent); object-fit:cover; }
        
        /* Inputs */
        textarea, input { width:100%; background:#222; border:none; color:white; padding:15px; border-radius:12px; box-sizing:border-box; font-family:inherit; margin-bottom:15px; }
        .btn-main { background:var(--accent); color:white; border:none; padding:15px; width:100%; border-radius:12px; font-weight:bold; font-size:1rem; cursor:pointer; }
    </style>
</head>
"""

# --- VISTAS ---

@app.route('/')
def index():
    # Renderizar lista de personas
    people_html = ""
    for p in PEOPLE:
        people_html += f"""
        <div style="display:flex; flex-direction:column; align-items:center; min-width:60px">
            <img src="{p['img']}" class="av-circle">
            <span style="font-size:0.75rem; color:#a0a0a0; margin-top:5px">{p['name'].split()[0]}</span>
        </div>"""
    
    # Renderizar memorias (feed)
    memories_html = ""
    for m in MEMORIES:
        img_html = f'<img src="{m["img"]}">' if m["img"] else ''
        memories_html += f"""
        <div class="card">
            {img_html}
            <div style="flex:1">
                <div style="font-size:0.7rem; color:var(--accent); text-transform:uppercase; margin-bottom:5px">{m['date']} • {m['author']}</div>
                <h3 style="margin:0 0 5px 0; font-size:1rem">{m['title']}</h3>
                <div style="font-size:0.8rem; color:#a0a0a0">{m['desc']}</div>
            </div>
        </div>"""

    return f"""<!doctype html><html>{HEAD}<body><div class="app">
        <header style="padding:20px; display:flex; justify-content:space-between; align-items:center">
            <div><h2 style="margin:0">Hola, Familia</h2><small style="color:#a0a0a0">Tu legado digital</small></div>
            <i class="fas fa-bell" style="color:#a0a0a0"></i>
        </header>
        
        <div class="avatars">
            <a href="/add" style="text-decoration:none"><div style="width:60px; height:60px; border-radius:50%; background:#333; display:flex; align-items:center; justify-content:center; color:white"><i class="fas fa-plus"></i></div></a>
            {people_html}
        </div>

        <div style="padding:0 20px; margin-top:30px; font-weight:600">Recuerdos recientes</div>
        {memories_html}

        <a href="/add" class="fab"><i class="fas fa-pen"></i></a>
        <div class="navbar">
            <a href="/" class="nav-item active"><i class="fas fa-home"></i></a>
            <a href="#" class="nav-item"><i class="fas fa-book"></i></a>
            <a href="/genealogy" class="nav-item"><i class="fas fa-users"></i></a>
        </div>
    </div></body></html>"""

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        # LOGICA CONECTADA: Guardar lo que viene del formulario
        text = request.form.get('story', '')
        title = "Recuerdo Nuevo"
        
        # Crear nueva memoria
        new_memory = {
            "title": title,
            "date": "Ahora mismo",
            "author": "Yo", # Hardcodeado por simplicidad
            "desc": text,
            "img": "", # Sin imagen por ahora
            "type": "text"
        }
        # Insertar al principio de la lista
        MEMORIES.insert(0, new_memory)
        return redirect('/')

    return f"""<!doctype html><html>{HEAD}<body><div class="app">
        <div style="padding:20px; display:flex; align-items:center">
            <a href="/" style="color:white; font-size:1.5rem"><i class="fas fa-arrow-left"></i></a>
            <h2 style="flex:1; text-align:center; margin:0">Nuevo Recuerdo</h2>
        </div>

        <form method="post" style="padding:20px">
            <div style="text-align:center; margin:20px 0;">
                <button type="button" onclick="alert('Funcionalidad de grabación simulada: Audio guardado.')" style="width:80px; height:80px; border-radius:50%; background:var(--accent); border:none; font-size:24px; color:white; cursor:pointer"><i class="fas fa-microphone"></i></button>
                <p style="font-size:0.8rem; color:#a0a0a0; margin-top:10px">Toca para grabar</p>
            </div>

            <h3 style="margin-bottom:10px">O escríbelo</h3>
            <textarea name="story" rows="6" placeholder="Escribe aquí tu historia familiar..." required></textarea>
            
            <button type="submit" class="btn-main">Publicar Recuerdo</button>
        </form>
    </div></body></html>"""

@app.route('/genealogy')
def genealogy():
    return f"""<!doctype html><html>{HEAD}<body><div class="app">
        <div style="padding:20px; display:flex; align-items:center">
            <a href="/" style="color:white; font-size:1.5rem"><i class="fas fa-arrow-left"></i></a>
            <h2 style="flex:1; text-align:center; margin:0">Árbol Familiar</h2>
        </div>
        <div style="padding:20px; text-align:center; color:#a0a0a0">
            <div style="border:1px solid #333; padding:20px; border-radius:12px; margin-bottom:20px">
                <i class="fas fa-tree" style="font-size:3rem; color:var(--accent); margin-bottom:10px"></i>
                <p>Vista de Árbol en construcción</p>
            </div>
        </div>
        <div class="navbar">
            <a href="/" class="nav-item"><i class="fas fa-home"></i></a>
            <a href="#" class="nav-item"><i class="fas fa-book"></i></a>
            <a href="/genealogy" class="nav-item active"><i class="fas fa-users"></i></a>
        </div>
    </div></body></html>"""
