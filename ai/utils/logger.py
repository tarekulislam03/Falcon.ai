"""
Centralized logging utility for the AI services.
"""
import logging
import sys
from config.settings import LOG_LEVEL, APP_NAME

def get_logger(module_name: str) -> logging.Logger:
    """
    Returns a configured logger instance.
    
    Args:
        module_name (str): The name of the module requesting the logger.
        
    Returns:
        logging.Logger: The configured logger instance.
    """
    logger = logging.getLogger(f"{APP_NAME}.{module_name}")
    
    if not logger.handlers:
        logger.setLevel(LOG_LEVEL)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(LOG_LEVEL)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(formatter)
        
        logger.addHandler(console_handler)
        
    return logger
