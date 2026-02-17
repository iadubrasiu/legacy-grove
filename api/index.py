from flask import Flask, request, redirect, url_for, render_template_string
import random

app = Flask(__name__)

# --- DATOS MOCK (Para que se vea lleno y bonito) ---
PEOPLE = [
    {"id": 1, "name": "Abuelo Juan", "role": "El guardián de las historias", "img": "https://i.pravatar.cc/150?u=a042581f4e29026024d", "memories": 24, "hours": 3.5, "photos": 58},
    {"id": 2, "name": "Tía Marta", "role": "La aventurera", "img": "https://i.pravatar.cc/150?u=a042581f4e29026704d", "memories": 12, "hours": 1.2, "photos": 30},
    {"id": 3, "name": "Mamá", "role": "Corazón de familia", "img": "https://i.pravatar.cc/150?u=a042581f4e29026703d", "memories": 45, "hours": 10.0, "photos": 120},
]

MEMORIES = [
    {"title": "Mi primer día de escuela", "date": "Hace 2 horas", "author": "Abuelo Juan", "desc": "Corría el año 1950, el sol brillaba y yo...", "img": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "type": "text"},
    {"title": "La receta secreta", "date": "Ayer", "author": "Abuela", "desc": "Finalmente encontré el cuaderno donde anotamos...", "img": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "type": "recipe"},
    {"title": "Nuestro viaje a la costa", "date": "3 días atrás", "author": "Papá Carlos", "desc": "No podíamos parar de reír cuando el coche...", "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", "type": "image"}
]

# --- ESTILOS CSS (Dark Mode Premium) ---
CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --bg-dark: #0f0f0f;
    --card-dark: #1e1e1e;
    --accent: #ff9f43; /* Naranja premium */
    --text-main: #ffffff;
    --text-sec: #a0a0a0;
    --border: #333;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    min-height: 100vh;
}

/* Contenedor tipo Móvil */
.mobile-wrapper {
    width: 100%;
    max-width: 480px;
    background: var(--bg-dark);
    position: relative;
    padding-bottom: 80px; /* Espacio para navbar */
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
}

/* Header */
header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header-icons span { font-size: 1.2rem; margin-left: 15px; color: var(--text-sec); }

/* Avatar Row */
.family-row {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 10px 20px;
    scrollbar-width: none;
}
.avatar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
}
.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    object-fit: cover;
    margin-bottom: 5px;
}
.avatar-name { font-size: 0.75rem; color: var(--text-sec); }

/* Tarjetas */
.section-title { padding: 0 20px; margin-top: 30px; font-size: 1.1rem; font-weight: 600; }
.card {
    background: var(--card-dark);
    margin: 15px 20px;
    padding: 15px;
    border-radius: 16px;
    display: flex;
    gap: 15px;
    align-items: center;
}
.card img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
}
.card-content { flex: 1; }
.card-meta { font-size: 0.7rem; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
.card-title { font-size: 1rem; font-weight: 600; margin: 0 0 5px 0; }
.card-desc { font-size: 0.8rem; color: var(--text-sec); line-height: 1.4; }

/* FAB Button */
.fab {
    position: fixed;
    bottom: 90px;
    right: 20px;
    background: var(--accent);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    box-shadow: 0 4px 15px rgba(255, 159, 67, 0.4);
    text-decoration: none;
}

/* Navbar */
.navbar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: #161616;
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-top: 1px solid var(--border);
}
.nav-item {
    color: var(--text-sec);
    text-decoration: none;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.nav-item.active { color: var(--accent); }

/* Perfil Styles */
.profile-header { text-align: center; padding: 40px 20px 20px; }
.profile-avatar { width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--accent); }
.stats-row { display: flex; justify-content: space-around; padding: 20px; border-bottom: 1px solid var(--border); }
.stat-box { text-align: center; }
.stat-num { display: block; font-size: 1.2rem; font-weight: bold; }
.stat-label { font-size: 0.7rem; color: var(--text-sec); }

/* Editor Styles */
.record-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--accent);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px auto;
    font-size: 2rem;
    color: white;
}
</style>
<!-- Iconos -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
"""

LAYOUT_START = f"""<!doctype html><html><head><title>LegacyGrove</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">{CSS}</head><body><div class="mobile-wrapper">"""
LAYOUT_END = """
    <a href="/add" class="fab"><i class="fas fa-plus"></i></a>
    <div class="navbar">
        <a href="/" class="nav-item active"><i class="fas fa-home"></i></a>
        <a href="#" class="nav-item"><i class="fas fa-book-open"></i></a>
        <a href="/genealogy" class="nav-item"><i class="fas fa-users"></i></a>
        <a href="#" class="nav-item"><i class="fas fa-user"></i></a>
    </div>
</div></body></html>
"""

@app.route('/')
def index():
    # Header
    html = LAYOUT_START + """
    <header>
        <div>
            <h2 style="margin:0">Hola, Ana</h2>
            <small style="color:var(--text-sec)">¿Qué historia recordaremos hoy?</small>
        </div>
        <div class="header-icons">
            <span><i class="fas fa-bell"></i></span>
            <span><i class="fas fa-search"></i></span>
        </div>
    </header>
    """
    
    # Family Row
    html += '<div class="family-row">'
    html += f'<div class="avatar-col"><div class="avatar" style="background:#333;display:flex;align-items:center;justify-content:center"><i class="fas fa-plus"></i></div><span class="avatar-name">Añadir</span></div>'
    for p in PEOPLE:
        html += f"""
        <a href="/profile/{p['id']}" class="avatar-col" style="text-decoration:none">
            <img src="{p['img']}" class="avatar">
            <span class="avatar-name">{p['name'].split()[0]}</span>
        </a>
        """
    html += '</div>'

    # Recent Memories
    html += '<div class="section-title">Recuerdos recientes</div>'
    for m in MEMORIES:
        html += f"""
        <div class="card">
            <img src="{m['img']}">
            <div class="card-content">
                <div class="card-meta">{m['date']} • {m['author']}</div>
                <h3 class="card-title">{m['title']}</h3>
                <div class="card-desc">{m['desc']}</div>
            </div>
        </div>
        """
    
    return html + LAYOUT_END

@app.route('/profile/<int:id>')
def profile(id):
    p = next((x for x in PEOPLE if x['id'] == id), PEOPLE[0])
    html = LAYOUT_START + f"""
    <div style="padding:20px; display:flex; align-items:center;">
        <a href="/" style="color:white; font-size:1.5rem;"><i class="fas fa-arrow-left"></i></a>
        <span style="flex:1; text-align:center; font-weight:bold;">Perfil de Familiar</span>
        <i class="fas fa-ellipsis-h"></i>
    </div>
    
    <div class="profile-header">
        <img src="{p['img']}" class="profile-avatar">
        <h1 style="margin:10px 0 5px 0">{p['name']}</h1>
        <p style="color:var(--text-sec); margin:0">{p['role']}</p>
    </div>

    <div class="stats-row">
        <div class="stat-box"><span class="stat-num">{p['memories']}</span><span class="stat-label">MEMORIAS</span></div>
        <div class="stat-box"><span class="stat-num">{p['hours']}h</span><span class="stat-label">AUDIO</span></div>
        <div class="stat-box"><span class="stat-num">{p['photos']}</span><span class="stat-label">FOTOS</span></div>
    </div>

    <div class="section-title">Capítulo de Vida (65%)</div>
    <div style="margin:10px 20px; height:6px; background:#333; border-radius:3px;">
        <div style="width:65%; height:100%; background:var(--accent); border-radius:3px;"></div>
    </div>
    """
    return html + LAYOUT_END

@app.route('/add')
def add():
    html = LAYOUT_START + """
    <div style="padding:20px;">
        <h2 style="text-align:center; color:var(--accent)">¿Cómo conociste a la Abuela?</h2>
        <p style="text-align:center; color:var(--text-sec)">Comparte tus mejores recuerdos</p>
        
        <div style="text-align:center; margin-top:20px;">
            <img src="https://i.imgur.com/EQ5Y5Yt.png" style="width:100%; opacity:0.3;">
        </div>

        <button class="record-btn"><i class="fas fa-microphone"></i></button>
        <p style="text-align:center; font-weight:bold;">TOCA PARA GRABAR</p>
        
        <h3 style="margin-top:40px">Tu historia escrita</h3>
        <textarea style="width:100%; height:150px; background:#222; border:none; color:white; padding:15px; border-radius:12px;" placeholder="Empieza a escribir aquellos detalles..."></textarea>
    </div>
    """
    return html + LAYOUT_END

@app.route('/genealogy')
def genealogy():
    html = LAYOUT_START + """
    <div style="padding:20px; text-align:center">
        <h2>Árbol de Familia</h2>
        <div style="display:flex; justify-content:center; gap:20px; margin-top:40px">
            """
    for p in PEOPLE:
        html += f"""
        <div style="display:flex; flex-direction:column; align-items:center">
            <img src="{p['img']}" style="width:50px; height:50px; border-radius:50%; border:2px solid #555">
            <small style="margin-top:5px">{p['name'].split()[0]}</small>
        </div>
        """
    html += """
        </div>
        <div style="height:40px; border-left:2px solid #555; width:2px; margin:0 auto;"></div>
        <div style="border:2px solid var(--accent); padding:10px; border-radius:50%; width:60px; height:60px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
            <img src="https://i.pravatar.cc/150?img=12" style="width:100%; border-radius:50%">
        </div>
        <p><strong>Andrés García</strong></p>
    </div>
    """
    return html + LAYOUT_END
