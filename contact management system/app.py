# Project: Contact Management System
# Name: Diksha Kumari
# Date: 2026-04-16

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# In-memory storage
contacts = []
contact_id = 1


@app.route('/')
def index():
    search = request.args.get('search')

    if search:
        filtered = [
            c for c in contacts
            if search.lower() in c['name'].lower() or search in c['phone']
        ]
        return render_template('index.html', contacts=filtered, search=search)

    return render_template('index.html', contacts=contacts)


@app.route('/add', methods=['GET', 'POST'])
def add_contact():
    global contact_id

    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        email = request.form['email']

        if not name or not phone or not email:
            return "All fields are required!"

        contacts.append({
            'id': contact_id,
            'name': name,
            'phone': phone,
            'email': email
        })
        contact_id += 1

        return redirect(url_for('index'))

    return render_template('add_contact.html')


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_contact(id):
    contact = next((c for c in contacts if c['id'] == id), None)

    if request.method == 'POST':
        contact['name'] = request.form['name']
        contact['phone'] = request.form['phone']
        contact['email'] = request.form['email']
        return redirect(url_for('index'))

    return render_template('edit_contact.html', contact=contact)


@app.route('/delete/<int:id>')
def delete_contact(id):
    global contacts
    contacts = [c for c in contacts if c['id'] != id]
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)