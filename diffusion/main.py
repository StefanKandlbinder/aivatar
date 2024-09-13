# from diffusers import StableDiffusionPipeline
# import torch
# import os
# from huggingface_hub import login

# token = os.getenv("HUGGINGFACE_TOKEN_STABLE_DIFFUSION_V15")

# # TOKEN
# print("TOKEN: ", torch.cuda.is_available())

# login(token="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")

# # Is CUDA available?
# print("CUDA: ", torch.cuda.is_available())

# # Is MPS even available? macOS 12.3+
# print("MPS: ", torch.backends.mps.is_available())

# # Was the current version of PyTorch built with MPS activated?
# print("MPS BUILT: ", torch.backends.mps.is_built())


# pipe = StableDiffusionPipeline.from_pretrained(
#     "benjamin-paine/stable-diffusion-v1-5",
#     torch_dtype=torch.float32,
#     # variant="fp16",
#     use_safetensors=True
# )

# # Check if MPS is available and use it, otherwise default to CPU
# if torch.backends.mps.is_available():
#     device = torch.device("mps")
# else:
#     device = torch.device("cpu")

# pipe = pipe.to(device)

# # Recommended if your computer has < 64 GB of RAM
# pipe.enable_attention_slicing()

# prompt = "a photo of an astronaut riding a horse on mars"
# image = pipe(prompt).images[0]
    
# image.save("astronaut_rides_horse.png")

import os
from typing import TypedDict
import PIL
import torch
import base64
import io
from torch import Tensor, autocast, float32, manual_seed
from diffusers import FluxPipeline
from diffusers import StableDiffusionPipeline
from diffusers import DiffusionPipeline
from diffusers import StableDiffusionXLPipeline, AutoPipelineForText2Image, UNet2DConditionModel
from diffusers import  UniPCMultistepScheduler, UNet2DModel, AutoencoderKL, EulerDiscreteScheduler
from transformers import CLIPTextModel, CLIPTokenizer
from tqdm.auto import tqdm
from huggingface_hub import login
from PIL import Image

class TextToImageFlux:
    """A simple TextToImage class"""

    def __init__(self) -> None:
        pass

    def get_image(self, prompt:str) -> io.BytesIO:
        """Accepts a prompt and returns an image"""

        # token = os.getenv("HUGGINGFACE_TOKEN")
        login(token="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")

        # Is CUDA available?
        print("CUDA: ", torch.cuda.is_available())

        # Is MPS even available? macOS 12.3+
        print("MPS: ", torch.backends.mps.is_available())

        # Was the current version of PyTorch built with MPS activated?
        print("MPS BUILT: ", torch.backends.mps.is_built())

        pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.float32, use_safetensors=True)

        # Check if MPS is available and use it, otherwise default to CPU
        if torch.backends.mps.is_available():
            device = torch.device("mps")
        else:
            device = torch.device("cpu")

        pipe = pipe.to(device)

        # Recommended if your computer has < 64 GB of RAM
        pipe.enable_attention_slicing()

        #save some VRAM by offloading the model to CPU. Remove this if you have enough GPU power
        pipe.enable_model_cpu_offload() 

        # with autocast("mps"):
        #     image = pipe(
        #         prompt,
        #         height=640,
        #         width=640,
        #         guidance_scale=3.5,
        #         num_inference_steps=50,
        #         max_sequence_length=512,
        #         # generator=torch.Generator("cpu").manual_seed(0)
        #     )["sample"][0]

        # img_data = io.BytesIO()
        # image.save(img_data, "PNG")
        # img_data.seek(0)

        image = pipe(
            prompt,
            height=640,
            width=640,
            guidance_scale=3.5,
            num_inference_steps=50,
            max_sequence_length=512,
            generator=torch.Generator("mps").manual_seed(0)
        ).images[0]

        return image
    
class TextToImageStableDiffusionV15:
    """A simple TextToImage class"""

    UrlType = TypedDict('UrlType', 
        {
            'prompt': str, 
            'num_inference_steps':int,
            'width':int,
            'height':int,
            'seed': int
        }
    )

    def __init__(self) -> None:
        pass

    def pil_image_to_base64(self, image: Image.Image) -> str:
        """Converts a PIL.Image into a base64 encoded jpg image"""

        # Create a BytesIO buffer to hold the image data
        buffered = io.BytesIO()
        
        # Save the image to the buffer in JPEG format
        image.save(buffered, format="JPEG")
        
        # Get the byte data from the buffer
        img_bytes = buffered.getvalue()
        
        # Encode the byte data to a base64 string
        img_base64 = base64.b64encode(img_bytes).decode('utf-8')
        
        return f"data:image/jpeg;charset=utf-8;base64, {img_base64}"

    def get_image(self, url:UrlType) -> str:
        """Accepts a prompt and returns an image"""

        # TOKENx
        print("TOKEN: ", torch.cuda.is_available())

        login(token="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")

        # Is CUDA available?
        print("CUDA: ", torch.cuda.is_available())

        # Is MPS even available? macOS 12.3+
        print("MPS: ", torch.backends.mps.is_available())

        # Was the current version of PyTorch built with MPS activated?
        print("MPS BUILT: ", torch.backends.mps.is_built())


        pipe = StableDiffusionPipeline.from_pretrained(
            "benjamin-paine/stable-diffusion-v1-5",
            torch_dtype=torch.float32,
            # variant="fp16",
            use_safetensors=True
        )

        # Check if MPS is available and use it, otherwise default to CPU
        if torch.backends.mps.is_available():
            device = torch.device("mps")
        else:
            device = torch.device("cpu")

        pipe = pipe.to(device)

        # Recommended if your computer has < 64 GB of RAM
        pipe.enable_attention_slicing()

        print("Creating image from prompt: ", url.values())

        image = pipe( 
            prompt = url["prompt"],
            height=url["height"],
            width=url["width"],
            guidance_scale=3.5,
            num_inference_steps=url["num_inference_steps"],
            max_sequence_length=512,
            manual_seed=url["seed"]
        ).images[0]

        return self.pil_image_to_base64(image)

class TextToImageStableDiffusionXL:
    """A simple TextToImage class"""

    UrlType = TypedDict('UrlType', 
        {
            'prompt': str, 
            'num_inference_steps':int,
            'width':int,
            'height':int,
            'seed': int
        }
    )

    def __init__(self) -> None:
        """Accepts a prompt and returns an image"""
        
        # token = os.getenv("HUGGINGFACE_TOKEN")
        # TOKEN
        # print("TOKEN: ", torch.cuda.is_available())
        login(token="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")

        # Is CUDA available?
        print("CUDA: ", torch.cuda.is_available())

        # Is MPS even available? macOS 12.3+
        print("MPS: ", torch.backends.mps.is_available())

        # Was the current version of PyTorch built with MPS activated?
        print("MPS BUILT: ", torch.backends.mps.is_built())

        self.repo_id = "stabilityai/stable-diffusion-xl-base-1.0"

        self.pipe = AutoPipelineForText2Image.from_pretrained(
            self.repo_id,
            torch_dtype=torch.float16,
            use_safetensors=True,
            variant="fp16"
        )

        # Check if MPS is available and use it, otherwise default to CPU
        if torch.backends.cuda.is_built():
            self.device = torch.device("cuda")
            self.pipe.enable_model_cpu_offload()
            self.model = UNet2DConditionModel.from_pretrained(self.repo_id).to("cuda")
            self.vae = AutoencoderKL.from_pretrained(self.repo_id, subfolder="vae").to("cuda")
            self.text_encoder = CLIPTextModel.from_pretrained(self.repo_id, subfolder="text_encoder").to("cuda")
            
        if torch.backends.mps.is_built():
            self.device = torch.device("mps")
            # self.model = UNet2DConditionModel.from_pretrained(self.repo_id, subfolder="unet",  use_safetensors=True).to("mps")
            # self.vae = AutoencoderKL.from_pretrained(self.repo_id, subfolder="vae",  use_safetensors=True).to("mps")
            # self.text_encoder = CLIPTextModel.from_pretrained(self.repo_id, subfolder="text_encoder",  use_safetensors=True).to("mps")
            # pipe.enable_attention_slicing()
        else:
            self.device = torch.device("cpu")
            self.model = UNet2DConditionModel.from_pretrained(self.repo_id).to("cpu")
            self.vae = AutoencoderKL.from_pretrained(self.repo_id, subfolder="vae").to("cpu")
            self.text_encoder = CLIPTextModel.from_pretrained(self.repo_id, subfolder="text_encoder").to("mps")

        self.pipe = self.pipe.to(self.device)
        self.generator=torch.Generator("mps")
        # self.scheduler=EulerDiscreteScheduler.from_pretrained(self.repo_id, subfolder="scheduler")
        # self.tokenizer = CLIPTokenizer.from_pretrained(self.repo_id, subfolder="tokenizer")
        # self.guidance_scale = 7.5 

    def pil_image_to_base64(self, image: Image.Image) -> str:
        """Converts a PIL.Image into a base64 encoded jpg image"""

        # Create a BytesIO buffer to hold the image data
        buffered = io.BytesIO()
        
        # Save the image to the buffer in JPEG format
        image.save(buffered, format="JPEG")
        
        # Get the byte data from the buffer
        img_bytes = buffered.getvalue()
        
        # Encode the byte data to a base64 string
        img_base64 = base64.b64encode(img_bytes).decode('utf-8')
        
        return f"data:image/jpeg;charset=utf-8;base64, {img_base64}"

    def get_image(self, url:UrlType) -> str:
        print("Creating image from prompt: ", url.values())

        image:Image.Image = self.pipe(
            prompt = url["prompt"],
            height=url["height"],
            width=url["width"],
            guidance_scale=3.5,
            num_inference_steps=url["num_inference_steps"],
            max_sequence_length=512,
            # manual_seed=url["seed"] # random seed
            generator=self.generator.manual_seed(url["seed"]) # generate your own seed
        ).images[0]

        return self.pil_image_to_base64(image)
    
    def get_image_stream(self, url:UrlType):
        """Generate images based on the prompt and return base64 images for each diffusion step."""

        print("Creating image stream from prompt: ", url.values())

        # sample_size = self.model.config.sample_size
        # noise = torch.randn((1, 3, sample_size, sample_size)).to("mps")
        text_input = self.tokenizer(
            url["prompt"],
            padding="max_length",
            max_length=self.tokenizer.model_max_length, 
            truncation=True,
            return_tensors="pt"
        )

        with torch.no_grad():
            text_embeds = self.text_encoder(text_input.input_ids.to(self.device))[0]
        
        max_length = text_input.input_ids.shape[-1]
        uncond_input = self.tokenizer([""] * len(
            url["prompt"]),
            padding="max_length",
            max_length=max_length,return_tensors="pt"
        )
        uncond_embeddings = self.text_encoder(uncond_input.input_ids.to(self.device))[0]
        text_embeds = torch.cat([uncond_embeddings, text_embeds])
        
        latents = torch.randn(
            (
                len(url["prompt"]), 
                self.model.config.in_channels,
                url["height"] // 8, 
                url["width"] // 8
            ),
            device=self.device,
            # dtype=torch.float16,
            generator=self.generator
        )
        
        latents = latents * self.scheduler.init_noise_sigma

        self.scheduler.set_timesteps(url["num_inference_steps"])                         
        
        for t in tqdm(self.scheduler.timesteps):
            # timestep_index = self.scheduler.timesteps.index(t)
            # expand the latents if we are doing classifier-free guidance to avoid doing two forward passes.
            latent_model_input = torch.cat([latents] * 2)

            latent_model_input = self.scheduler.scale_model_input(latent_model_input, timestep=t)

            # predict the noise residual
            with torch.no_grad():
                noise_pred = self.model(
                    latent_model_input,
                    t,
                    encoder_hidden_states=text_embeds,
                    added_cond_kwargs={"text_embeds": text_embeds, "time_ids": t}).sample

            # perform guidance
            noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
            noise_pred = noise_pred_uncond + self.guidance_scale * (noise_pred_text - noise_pred_uncond)

            # compute the previous noisy sample x_t -> x_t-1
            latents = self.scheduler.step(noise_pred, t, latents).prev_sample

            latents = 1 / 0.18215 * latents
            with torch.no_grad():
                image = self.vae.decode(latents).sample
            
            image = (image / 2 + 0.5).clamp(0, 1).squeeze()
            image = (image.permute(1, 2, 0) * 255).to(torch.uint8).cpu().numpy()
            image = Image.fromarray(image)
            
            pil_image = self.pipe.numpy_to_pil(image)[0]
            yield self.pil_image_to_base64(pil_image)
            


        # input = noise

        # for t in self.scheduler.timesteps:
        #     with torch.no_grad():
        #         noisy_residual = self.model(input, t).sample
        #     previous_noisy_sample = self.scheduler.step(noisy_residual, t, input).prev_sample
        #     input = previous_noisy_sample

        #     image = (input / 2 + 0.5).clamp(0, 1)
        #     image = image.cpu().permute(0, 2, 3, 1).numpy()[0]
        #     # image = Image.fromarray((image * 255).round().astype("uint8"))
        #     print("image: ", image)

        

        # # Set the seed for reproducibility
        # torch.manual_seed(url["seed"])

        # # for step in range(url["num_inference_steps"]):
        # #     # Generate the image at the current step
        # #     with torch.no_grad():
        # #         output_image = self.pipe(
        # #             url["prompt"],
        # #             num_inference_steps=1, 
        # #             width=url["width"],
        # #             height=url["height"],
        # #             generator=self.generator).images[0]
                
        # #         base64_image = self.pil_image_to_base64(output_image)

        # #         # Optionally, you can print or log the current step
        # #         print(f"Step {step + 1}/{url["num_inference_steps"]} completed.")

        # #     yield step + 1, base64_image
        
        # # generator = torch.manual_seed(url["seed"])
        
        # # Encode prompt
        # text_embeddings = self.pipe.text_encoder(self.pipe.tokenizer(
        #     url["prompt"],
        #     return_tensors="pt").input_ids.to(self.device))[0]

        # # Initial latent noise
        # latents = torch.randn(
        #     (
        #         1, 
        #         self.pipe.unet.config.in_channels,
        #         url["height"], url["width"]
        #     ),
        #     generator=self.generator,
        #     device=self.device,
        #     dtype=torch.float16
        # )

        # # Prepare the timesteps
        # timesteps = torch.linspace(1, 0, url["num_inference_steps"], device=self.device,  dtype=torch.float16)

        # print("timesteps: ", timesteps)

        # for i, t in enumerate(timesteps):
        #     # Predict noise residual
        #     with torch.no_grad():
        #         noise_pred = self.pipe.unet(
        #             latents,
        #             t,
        #             encoder_hidden_states=text_embeddings,
        #             added_cond_kwargs={"text_embeds": text_embeddings})["sample"]

        #     # Update latents using the predicted noise residual
        #     latents = latents - noise_pred

        #     # Decode latents to images
        #     image = self.pipe.decode_latents(latents)

        #     # Convert the image to PIL format and yield it
        #     pil_image = self.pipe.numpy_to_pil(image)[0]

        #     yield i + 1, self.pil_image_to_base64(pil_image)