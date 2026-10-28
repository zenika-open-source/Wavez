"""Domain-level errors raised by the Wavez core, independent of any UI layer."""

from __future__ import annotations


class WavezError(Exception):
    """Raised when initialization input or environment is invalid."""
