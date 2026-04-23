from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# ================= DB INIT =================
def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        amount INTEGER,
        category TEXT
    )''')

    conn.commit()
    conn.close()

init_db()


# ================= ROUTES =================
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/about")
def about():
    return render_template("about.html")


# ================= AUTH =================
@app.route("/signup_user", methods=["POST"])
def signup_user():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("INSERT INTO users (username, password) VALUES (?, ?)",
              (data["username"], data["password"]))

    conn.commit()
    conn.close()

    return jsonify({"message": "User created"})


@app.route("/login_user", methods=["POST"])
def login_user():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE username=? AND password=?",
              (data["username"], data["password"]))

    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "fail"})


# ================= TRANSACTIONS =================
@app.route("/add_transaction", methods=["POST"])
def add_transaction():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("INSERT INTO transactions (text, amount, category) VALUES (?, ?, ?)",
              (data["text"], data["amount"], data["category"]))

    conn.commit()
    conn.close()

    return jsonify({"message": "Added"})


@app.route("/get_transactions")
def get_transactions():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("SELECT * FROM transactions")
    rows = c.fetchall()

    conn.close()

    transactions = []
    for row in rows:
        transactions.append({
            "id": row[0],
            "text": row[1],
            "amount": row[2],
            "category": row[3]
        })

    return jsonify(transactions)


@app.route("/delete_transaction/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("DELETE FROM transactions WHERE id=?", (id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})


if __name__ == "__main__":
    app.run(debug=True)