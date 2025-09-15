# components/spell_corrector.py
from typing import List, Optional
from rasa.engine.graph import GraphComponent, ExecutionContext
from rasa.engine.storage.resource import Resource
from rasa.shared.nlu.training_data.message import Message
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from spellchecker import SpellChecker

@DefaultV1Recipe.register(
    DefaultV1Recipe.ComponentType.MESSAGE_PROCESSOR,
    is_trainable=True,
    model_name="spell_corrector"
)
class SpellCorrector(GraphComponent):

    @classmethod
    def create(
        cls,
        config: Optional[dict],
        resource: Optional[Resource],
        execution_context: Optional[ExecutionContext],
    ) -> "SpellCorrector":
        return cls()

    def __init__(self):
        self.spell = SpellChecker()

    def process(self, messages: List[Message]) -> List[Message]:
        for message in messages:
            if not message.text:
                continue
            words = message.text.split()
            corrected_words = [self.spell.correction(word) for word in words]
            corrected_text = " ".join(corrected_words)
            message.text = corrected_text
            message.set("corrected_text", corrected_text, add_to_output=True)
        return messages

    def process_training_data(self, messages: List[Message], **kwargs) -> List[Message]:
        # optional: same as process for training
        return self.process(messages)
