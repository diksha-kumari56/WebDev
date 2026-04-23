"""
Project: Event Management Website (Experiment - 4)
Student Name: DIKSHA KUMARI
Description: Full Flask implementation with Admin CRUD capabilities.
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = 'diksha_event_management_2026'

# Task 2: Data stored in a list of dictionaries (Acting as a temporary database)
events_list = [
    {"id": 1, "name": "Tech Symposium 2026", "date": "2026-05-12", "venue": "Main Auditorium", "desc": "Exploring future AI trends."},
    {"id": 2, "name": "Web Dev Workshop", "date": "2026-06-05", "venue": "Lab 101", "desc": "Hands-on Flask training."},
    {"id": 3, "name": "Cultural Fest", "date": "2026-07-20", "venue": "Open Ground", "desc": "Music, dance, and food stalls."},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/events')
def events():
    return render_template('events.html', events=events_list)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        flash("Registration Successful! See you there.", "success")
        return redirect(url_for('events'))
    return render_template('register.html', events=events_list)

# --- ADMIN SECTION ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Credentials for login
        if request.form.get('username') == "admin" and request.form.get('password') == "1234":
            session['admin_logged_in'] = True
            flash("Welcome to the Admin Dashboard", "success")
            return redirect(url_for('admin'))
        flash("Invalid credentials!", "danger")
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('admin_logged_in'):
        flash("Please login to access the Admin Panel.", "danger")
        return redirect(url_for('login'))
    return render_template('admin.html', events=events_list)

@app.route('/admin/edit/<int:event_id>', methods=['GET', 'POST'])
def edit_event(event_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('login'))
    
    # Find the specific event to edit
    event = next((e for e in events_list if e['id'] == event_id), None)
    
    if request.method == 'POST':
        event['name'] = request.form.get('name')
        event['date'] = request.form.get('date')
        event['venue'] = request.form.get('venue')
        event['desc'] = request.form.get('desc')
        flash("Event updated successfully!", "success")
        return redirect(url_for('admin'))
        
    return render_template('edit.html', event=event)

@app.route('/admin/delete/<int:event_id>')
def delete_event(event_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('login'))
        
    global events_list
    events_list = [e for e in events_list if e['id'] != event_id]
    flash("Event deleted successfully.", "success")
    return redirect(url_for('admin'))

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    flash("You have been logged out.", "success")
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)