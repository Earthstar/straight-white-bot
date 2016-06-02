import requests

from bs4 import BeautifulSoup
from lxml import html

def scrape_page(pageNum):

    page = requests.get('http://straightwhiteboystexting.org/page/' + str(pageNum))
    tree = html.fromstring(page.content)

    images = tree.xpath('//div[contains(@class,"post")]//img')
    image_urls = []
    for image in images:
        image_urls.append(image.get('src'))

    print image_urls

scrape_page(2)