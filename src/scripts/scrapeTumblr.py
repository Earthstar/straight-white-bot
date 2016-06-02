import requests
from urlparse import urlparse
import os.path

from PIL import Image
from StringIO import StringIO

from bs4 import BeautifulSoup
from lxml import html

def get_image_urls_on_page(pageNum):
    '''
    Returns the url of all images from a page on tumblr
    pageNum - an integer of page to scrape. one-indexed
    '''
    page = requests.get('http://straightwhiteboystexting.org/page/' + str(pageNum))
    tree = html.fromstring(page.content)

    images = tree.xpath('//div[contains(@class,"post")]//img')
    image_urls = []
    for image in images:
        image_urls.append(image.get('src'))

    return image_urls

def load_image(url):
    image_request = requests.get(url)
    image = Image.open(StringIO(image_request.content))
    file_name = get_image_name(url)
    image.save('screenshots/' + file_name, 'JPEG')

def get_image_name(url):
    path = urlparse(url).path
    directory, file = os.path.split(path)
    return file

def main():
    hasImages = True
    index = 1
    while hasImages:
        print 'On page: ' + str(index)
        image_urls = get_image_urls_on_page(index)
        if len(image_urls) == 0:
            hasImages = False
        for image_url in image_urls:
            load_image(image_url)
        index += 1
