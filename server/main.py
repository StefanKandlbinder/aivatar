from asyncio import sleep
import datetime
from flask import Flask, Response, stream_with_context
from diffusion.main import TextToImageStableDiffusionXL, TextToImageStableDiffusionV15

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

# Route for seeing a data
@app.route('/flux/<model>/<prompt>/<int:num_inference_steps>/<int:width>/<int:height>/<int:seed>')
def text_to_image(model, prompt, num_inference_steps, width, height, seed):
    """Get the prompt from the URL and generate an image"""

    base64_image: str

    match model:
        case 'stable-diffusion-v15':
            base64_image = TextToImageStableDiffusionV15().get_image(
                {
                    'model': model,
                    'prompt': prompt, 
                    'num_inference_steps': num_inference_steps,
                    'width': width,
                    'height': height,
                    'seed': seed
                }
            )
        case 'stable-diffusion-xl':
            base64_image = TextToImageStableDiffusionXL().get_image(
                {
                    'model': model,
                    'prompt': prompt, 
                    'num_inference_steps': num_inference_steps,
                    'width': width,
                    'height': height,
                    'seed': seed
                }
            )

    response = Response(base64_image, mimetype='text/plain')
    response.headers['Content-Type']='image/jpeg'
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age='0'"
    response.headers["Pragma"] = "no-cache"

    return response

@app.route('/flux/stream/<model>/<prompt>/<int:num_inference_steps>/<int:width>/<int:height>/<int:seed>')
def text_to_image_stream(model, prompt, num_inference_steps, width, height, seed):
    """Get the prompt from the URL and generate an image"""
    pipeline = TextToImageStableDiffusionXL()


    def generate():
        try:
            yield "event:start\ndata: stream\n\n"
            for step, image in pipeline.get_image_stream({
                'model': model,
                'prompt': prompt, 
                'num_inference_steps': num_inference_steps,
                'width': width,
                'height': height,
                'seed': seed
            }):
                print(f"Step {step}/{num_inference_steps}")
                yield f"event:message\ndata: {image}\n\n"
            yield "event:end\ndata: stream\n\n"
        except GeneratorExit:
            print('closed')
        # try:
        #     yield "event:start\ndata: stream\n\n"
        #     # Simulate some processing steps
        #     for step in range(num_inference_steps):
        #         # Here you would normally generate images or perform processing
        #         yield f"event:message\ndata: {prompt, step}\n\n"
                
        #     # Final message (optional)
        #     yield "event:end\ndata: stream\n\n"
        # except GeneratorExit:
        #     print('closed')
            
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

# Running app
if __name__ == '__main__':
	app.run(debug=True, port=8001)
