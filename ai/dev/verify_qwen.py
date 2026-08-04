"""
Development script to verify Qwen 2.5 14B Q4_K_M model integration.
"""
import sys
import os

# Add parent dir to path to allow importing core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.providers import ProviderFactory
from utils.logger import get_logger

logger = get_logger("verify_qwen")

def main():
    logger.info("Initializing ProviderFactory...")
    ProviderFactory.initialize()
    
    provider = ProviderFactory.get_provider()
    
    health = provider.health_check()
    logger.info(f"Health Check Before Generation: {health}")
    
    prompt = "Explain the importance of model orchestration in three sentences."
    logger.info(f"Sending prompt: {prompt}")
    
    try:
        response = provider.generate(prompt)
        logger.info(f"Generated Reply:\n{response['reply']}")
        logger.info(f"Usage Info: {response['usage']}")
        
        health = provider.health_check()
        logger.info(f"Health Check After Generation: {health}")
        
    except Exception as e:
        logger.error(f"Failed during generation: {str(e)}")

if __name__ == "__main__":
    main()
