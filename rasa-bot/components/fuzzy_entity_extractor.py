from typing import List, Optional
from rasa.engine.graph import GraphComponent, ExecutionContext
from rasa.engine.storage.resource import Resource
from rasa.shared.nlu.training_data.message import Message
from fuzzywuzzy import process as fuzzy_process

class FuzzyEntityExtractor(GraphComponent):
    """FuzzyEntityExtractor component:
    Matches user text against a predefined list of entities using fuzzy matching.
    Adds recognized entities to the message.
    """

    @classmethod
    def create(
        cls,
        config: Optional[dict],
        resource: Optional[Resource],
        execution_context: Optional[ExecutionContext],
    ) -> GraphComponent:
        return cls(config.get("entities_list", []))

    def __init__(self, entities_list: List[str]):
        self.entities_list = entities_list

    def process_training_data(self, messages: List[Message], **kwargs) -> List[Message]:
        # Add entities to training data if matched
        for message in messages:
            if not message.text:
                continue
            matches = []
            for entity in self.entities_list:
                score = fuzzy_process.extractOne(entity, [message.text])
                if score and score[1] > 80:  # threshold
                    matches.append({"entity": entity, "value": entity})
            if matches:
                message.set("entities", matches, add_to_output=True)
        return messages

    def process(self, messages: List[Message]) -> List[Message]:
        # Runtime entity extraction
        return self.process_training_data(messages)