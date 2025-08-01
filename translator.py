from transformers import MarianMTModel, MarianTokenizer, pipeline
import torch
import logging

logger = logging.getLogger(__name__)

class BilingualTranslator:
    def __init__(self):
        self.assertEqual(response.status_code, 400)

class BilingualTranslatorTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Load models once for all tests"""
        cls.translator = BilingualTranslator()

    def test_en_to_hi_translation(self):
        """Test English to Hindi translation functionality"""
        text = "Hello, how are you?"
        result = self.translator.translate(text, 'en-hi')
        self.assertIsInstance(result, str)
        self.assertGreater(len(result), 0)

    def test_hi_to_en_translation(self):
        """Test Hindi to English translation functionality"""
        text = "नमस्ते, आप कैसे हैं?"
        result = self.translator.translate(text, 'hi-en')
        self.assertIsInstance(result, str)
        self.assertGreater(len(result), 0)

    def test_invalid_direction_translator(self):
        """Test invalid direction in translator"""
        with self.assertRaises(ValueError):
            self.translator.translate("Hello", 'invalid-direction')

if __name__ == '__main__':
    unittest.main()
