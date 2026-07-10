import os
from flask import Flask, render_template

# Initialize the Flask app
app = Flask(__name__)

# This is a "route". It tells Flask what to do when the user visits the homepage ("/")
@app.route('/')
def home():
    # render_template looks inside the 'templates' folder for 'index.html'
    return render_template('index.html')

if __name__ == '__main__':
    # When running locally, PORT defaults to 5000.
    # When running on Render, it uses the PORT environment variable provided by the server.
    port = int(os.environ.get("PORT", 5000))
    
    # host='0.0.0.0' is required for cloud platforms to access the app
    app.run(host='0.0.0.0', port=port, debug=True)