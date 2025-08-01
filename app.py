## app.py (Main Flask Application)
```python
from flask import Flask, request, render_template, jsonify
import json
from translator import BilingualTranslator
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize translator
logger.info("Loading translation models...")
translator = BilingualTranslator()
logger.info("Translation models loaded successfully!")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data or 'direction' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: text and direction'
            }), 400
        
        text = data['text'].strip()
        direction = data['direction']
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text cannot be empty'
            }), 400
        
        if direction not in ['en-hi', 'hi-en']:
            return jsonify({
                'success': False,
                'error': 'Invalid direction. Use "en-hi" or "hi-en"'
            }), 400
        
        # Perform translation
        translated_text = translator.translate(text, direction)
        
        return jsonify({
            'success': True,
            'original_text': text,
            'translated_text': translated_text,
            'direction': direction
        })
    
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Translation failed: {str(e)}'
        }), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'models_loaded': translator.models_loaded})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
