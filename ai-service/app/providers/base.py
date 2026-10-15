from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_completion(self, prompt: str, system_prompt: str = "", temperature: float = 0.2) -> str:
        """Generate structured text or JSON completion from prompt"""
        pass

class BaseSTTProvider(ABC):
    @abstractmethod
    async def transcribe_audio(self, audio_bytes: bytes, language: str = "en-US") -> Dict[str, Any]:
        """Transcribe speech audio to text with timestamps and word tokens"""
        pass
