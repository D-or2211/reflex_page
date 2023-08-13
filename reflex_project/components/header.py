import reflex as rx
import requests
import random

class myState(rx.State):
    quote = ''
    author = ''
    
    def get_quote(self):
        url = 'https://type.fit/api/quotes'
        res = requests.get(url)
        data = res.json()
        rand_num = random.randrange(0, len(data))
        self.quote = data[rand_num]['text']
        self.author = data[rand_num]['author']
        

        
        
def header():
    return rx.responsive_grid(
        rx.center(
            rx.box(
                rx.heading("I'm Demian"),
                rx.heading('Python Developer', size='sm'),
                rx.button('Click here', margin_top='2rem', on_click=myState.get_quote),
            )
        ),
        rx.center(
            rx.image(src='/coding.png')
        ),
        columns = [1,2]
    )

def quote():
    return rx.box(
        rx.text(myState.quote, as_='b'),
        rx.text(myState.author)
    )