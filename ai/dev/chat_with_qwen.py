import os
import sys
import time

# Add the 'ai' directory to sys.path so we can import from core
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from core.providers.factory import ProviderFactory
from utils.logger import get_logger

logger = get_logger("dev.chat")

def main():
    print("Initializing ProviderFactory...")
    try:
        # Initialize the provider
        ProviderFactory.initialize()
        provider = ProviderFactory.get_provider()
        
        # Load the model explicitly so we can measure first response time better
        # and ensure it's loaded before the first prompt.
        print("Loading model... this may take a moment.")
        provider.load_model()
        
        # Verify health
        health = provider.health_check()
        if not health.get("model_loaded"):
            print("Error: Model failed to load according to health check.")
            sys.exit(1)
            
        model_name = os.path.basename(health.get("model_path", "Unknown"))
        backend = health.get("inference_backend", "Unknown")
        
        print("========================================")
        print("Falcon AI Developer Console")
        print(f"Model: {model_name}")
        print(f"Backend: {backend}")
        print("Type 'exit' or 'quit' to quit.")
        print("========================================")
        
        while True:
            try:
                user_input = input("\nYou: ")
                if user_input.strip().lower() in ['exit', 'quit']:
                    print("Exiting...")
                    break
                if not user_input.strip():
                    continue
                    
                print("Assistant: ", end="", flush=True)
                
                start_time = time.time()
                tokens = 0
                
                # Stream the response
                try:
                    for chunk in provider.generate_stream(user_input):
                        print(chunk, end="", flush=True)
                        tokens += 1
                except Exception as e:
                    print(f"\n[Error during generation: {str(e)}]")
                    logger.error(f"Generation error: {e}")
                    continue
                    
                print() # newline after generation
                end_time = time.time()
                generation_time = end_time - start_time
                tps = tokens / generation_time if generation_time > 0 else 0
                
                print("-" * 40)
                print(f"Generation Time : {generation_time:.2f} s")
                print(f"Tokens/sec      : {tps:.2f}")
                print("-" * 40)
                
            except KeyboardInterrupt:
                print("\nExiting (KeyboardInterrupt)...")
                break
            except Exception as e:
                print(f"\n[Unexpected error: {str(e)}]")
                logger.error(f"Unexpected error in chat loop: {e}")
                
    except Exception as e:
        print(f"Failed to initialize or run console: {str(e)}")
        logger.error(f"Console initialization error: {e}")

if __name__ == "__main__":
    main()
