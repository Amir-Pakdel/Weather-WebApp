import time
from collections import deque

class SlidingWindowCounter:
    def __init__(self, window_seconds: float = 60.0):
        self.window_seconds = window_seconds
        self.timestamps = deque()

    def hit(self):
        now = time.time()
        self.timestamps.append(now)
        self._evict(now)

    def count(self) -> int:
        self._evict(time.time())
        return len(self.timestamps)

    def _evict(self, current_time: float):
        threshold = current_time - self.window_seconds
        while self.timestamps and self.timestamps[0] < threshold:
            self.timestamps.popleft()
