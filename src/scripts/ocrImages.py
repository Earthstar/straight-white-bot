from PIL import Image
from pytesseract import pytesseract

def is_swb_color(color_tuple):
    '''
    color_tuple - a length 3 tuple of RGB colors
    returns True if the color corresponds to the color of the "swb" correspondent
    or 231, 230, 235
    '''
    r, g, b = color_tuple
    return r == 231 and g == 230 and b == 235

# 43, 140, 247

image = Image.open("screenshots/1ttp39.jpg")
width, height = image.size

pixel_access = image.load()
for h in xrange(height):
    for w in xrange(width):
        rgb_pixel = pixel_access[w, h]
        if is_swb_color(rgb_pixel):
            print "Found swb pixel"
            print w, h
            break


# print pytesseract.image_to_string(image)

