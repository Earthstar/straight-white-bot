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

def is_recipient_color(color_tuple):
    '''
    color_tuple - a length 3 tuple of RGB colors
    returns True if the color corresponds to the color of the "recipient" correspondent
    or 43, 140, 247
    '''
    r, g, b = color_tuple
    return r == 43 and g == 140 and b == 247

def is_color_in_row(pixel_access, width, y, color_def):
    '''
    pixel_access - loaded image that can be accessed by pixel
    width - width of image
    y - row to search
    color_def - function to identify color
    '''
    for x in xrange(width):
        rgb_pixel = pixel_access[x, y]
        if color_def(rgb_pixel):
            return True
    return False

image = Image.open("screenshots/1ttp39.jpg")
width, height = image.size
pixel_access = image.load()

# When searching the image, either we haven't found a band, or we're in a swb color band
# or we're in a recipient color band
# possible values are None, "swb" and "recipient"
search_mode = None

# it's a goddamned state machine

# y increases from top to bottom of image
lower_y = None
upper_y = None
# list of tuples of (lower_y, upper_y)
image_band_dimensions = []
for y in xrange(height):
    if search_mode == None:
        if (is_color_in_row(pixel_access, width, y, is_swb_color)):
            print "start of swb band"
            lower_y = y
            search_mode = 'swb'
            continue
    if search_mode == "swb":
        if (not is_color_in_row(pixel_access, width, y, is_swb_color)):
            print "End of swb band"
            upper_y = y
            search_mode = None
            image_band_dimensions.append((lower_y, upper_y))
            continue

image_bands = []
for band_dimension in image_band_dimensions:
    box = (0, band_dimension[0], width, band_dimension[1])
    region = image.crop(box)
    image_bands.append(region)

for band in image_bands:
    print pytesseract.image_to_string(band)