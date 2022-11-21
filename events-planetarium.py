import requests
from bs4 import BeautifulSoup as bs


# get raw text from website (using beautiful soup)
# includes advertisements, comments, ...
def scrape_page(url):
    html = requests.get(url).content
    soup = bs(html, 'html.parser')
    file = open("testfile.txt", "w", encoding="utf-8")

    eventTitles = soup.find_all("h3", {"class": "post-title"})
    eventImageDivs = soup.find_all("div", {"class": "rightList"})
    for title,div in zip(eventTitles,eventImageDivs):
        file.write(title.text.strip()+"\n")
        image = div.find("img")
        if image.has_attr('src'):
            big_image_link = image['src'].split("-142x142")
            big_image_link = big_image_link[0] + big_image_link[1]
            file.write(big_image_link+"\n")
    file.close()
    
# column name, column lastname, column email
if __name__ == "__main__":
    scrape_page('https://www.planetariumvv.com/evenements/')
