from collections import defaultdict, deque
from threading import Lock


class ConversationMemory:
    def __init__(self, max_messages: int = 12) -> None:
        self._max_messages = max_messages
        self._store: dict[str, deque[dict[str, str]]] = defaultdict(
            lambda: deque(maxlen=self._max_messages)
        )
        self._lock = Lock()

    def get_messages(self, session_id: str) -> list[dict[str, str]]:
        with self._lock:
            messages = self._store.get(session_id)
            return list(messages) if messages else []

    def add_message(self, session_id: str, role: str, content: str) -> None:
        if role not in {"user", "assistant"}:
            raise ValueError("role must be either 'user' or 'assistant'")

        clean_content = content.strip()
        if not clean_content:
            return

        with self._lock:
            self._store[session_id].append({"role": role, "content": clean_content})

