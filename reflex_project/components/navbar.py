import reflex as rx

def navbar():
    return rx.flex(
        rx.box(
            rx.link(
                rx.image(src='/logo.png', width='80px'),
                href='/'
            )
        ),
        rx.center(
            rx.menu(
                rx.menu_button('MENU'),
                rx.menu_list(
                    rx.link(rx.menu_item('About'), href='/aboutpage'),
                    rx.menu_item('Posts')
                )
            )
        ),
        justify_content = 'space-between',
    )