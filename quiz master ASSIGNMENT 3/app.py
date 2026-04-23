from flask import Flask, render_template, request

app = Flask(__name__)

questions = [
    {
        "question": "What does HTML stand for?",
        "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"],
        "answer": "Hyper Text Markup Language"
    },
    {
        "question": "Which tag is used to create a hyperlink?",
        "options": ["a tag", "link tag", "href tag", "h1 tag"],
        "answer": "a tag"
    },
    {
        "question": "Which CSS property changes text color?",
        "options": ["font-color", "text-color", "color", "background"],
        "answer": "color"
    },
    {
        "question": "Which language is used for backend in Flask?",
        "options": ["Java", "Python", "C++", "JavaScript"],
        "answer": "Python"
    },
    {
        "question": "Which of these is a JavaScript framework?",
        "options": ["Flask", "Django", "React", "HTML"],
        "answer": "React"
    }
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html', questions=questions)

@app.route('/result', methods=['POST'])
def result():
    score = 0

    for i in range(len(questions)):
        selected = request.form.get(f"q{i+1}")   # IMPORTANT FIX

        if selected and selected.strip() == questions[i]['answer']:
            score += 1

    return render_template('result.html', score=score, total=len(questions))

if __name__ == '__main__':
    app.run(debug=True)