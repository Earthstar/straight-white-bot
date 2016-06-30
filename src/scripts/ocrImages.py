from PIL import Image
from pytesseract import pytesseract
import random

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
    # r, g, b = color_tuple
    # return r == 43 and g == 140 and b == 247
    return fuzzy_match_color((43, 140, 247), color_tuple)

def fuzzy_match_color(expected, actual):
    epsilon = 10
    for i in xrange(len(expected)):
        expected_value = expected[i]
        actual_value = actual[i]
        actual_matches_expected = ((expected_value - epsilon) < actual_value) and ((expected_value + epsilon) > actual_value)
        if not actual_matches_expected:
            return False
    return True

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

def is_swb_color_in_row(pixel_access, width, y):
    return is_color_in_row(pixel_access, width, y, is_swb_color)

def is_recipient_color_in_row(pixel_access, width, y):
    return is_color_in_row(pixel_access, width, y, is_recipient_color)

def process_image():
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
    # list of tuples of (lower_y, upper y)
    image_band_dimensions = []
    for y in xrange(height):
        if search_mode == None:
            if is_swb_color_in_row(pixel_access, width, y):
                lower_y = y
                search_mode = 'swb'
                continue
            if is_recipient_color_in_row(pixel_access, width, y):
                lower_y = y
                search_mode = 'recipient'
                continue
        # I'm making the assumption that you're always going to have some space b/w the text bubbles
        if search_mode == "swb":
            if (not is_swb_color_in_row(pixel_access, width, y)):
                search_mode = None
                image_band_dimensions.append((lower_y, y))
                continue
        if search_mode == 'recipient':
            if (not is_recipient_color_in_row(pixel_access, width, y)):
                search_mode = None
                image_band_dimensions.append((lower_y, y))
                continue


    image_bands = []
    for band_dimension in image_band_dimensions:
        box = (0, band_dimension[0], width, band_dimension[1])
        region = image.crop(box)
        # region.show()
        image_bands.append(region)

    for band in image_bands:
        image_name = str(int(round(random.random() * 10000))) + '.jpg'
        print image_name
        band.save('screenshots/processed/' + image_name)
        print pytesseract.image_to_string(band)

    print pytesseract.image_to_string(image)

process_image()

# recipient_bubble = Image.open("screenshots/processed/8473.jpg")
