import { Fragment, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { connect, E, getAllLocalStorageItems, getRefValue, isTrue, preventDefault, processEvent, refs, uploadFiles } from "/utils/state"
import "focus-visible/dist/focus-visible"
import { Box, Button, Center, Container, Divider, Flex, Heading, Image, Link, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Text, useColorMode } from "@chakra-ui/react"
import NextLink from "next/link"
import NextHead from "next/head"


export default function Component() {
  const [my_state, setMy_state] = useState({"author": "", "is_hydrated": false, "quote": "", "events": [{"name": "my_state.hydrate"}], "files": []})
  const [result, setResult] = useState({"state": null, "events": [], "final": true, "processing": false})
  const [notConnected, setNotConnected] = useState(false)
  const router = useRouter()
  const socket = useRef(null)
  const { isReady } = router
  const { colorMode, toggleColorMode } = useColorMode()
  const focusRef = useRef();
  
  // Function to add new events to the event queue.
  const Event = (events, _e) => {
      preventDefault(_e);
      setMy_state(state => ({
        ...state,
        events: [...state.events, ...events],
      }))
  }

  // Function to add new files to be uploaded.
  const File = files => setMy_state(state => ({
    ...state,
    files,
  }))

  // Main event loop.
  useEffect(()=> {
    // Skip if the router is not ready.
    if (!isReady) {
      return;
    }

    // Initialize the websocket connection.
    if (!socket.current) {
      connect(socket, my_state, setMy_state, result, setResult, router, ['websocket', 'polling'], setNotConnected)
    }

    // If we are not processing an event, process the next event.
    if (!result.processing) {
      processEvent(my_state, setMy_state, result, setResult, router, socket.current)
    }

    // Reset the result.
    setResult(result => {
      // If there is a new result, update the state.
      if (result.state != null) {
        // Apply the new result to the state and the new events to the queue.
        setMy_state(state => {
          return {
            ...result.state,
            events: [...state.events, ...result.events],
          } 
        })
        return {
          state: null,
          events: [],
          final: true,
          processing: !result.final,
        }
      }
      return result;
    })

    // Process the next event.
    processEvent(my_state, setMy_state, result, setResult, router, socket.current)
  })

  // Set focus to the specified element.
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  })

  // Route after the initial page hydration.
  useEffect(() => {
    const change_complete = () => Event([E('my_state.hydrate', {})])
    router.events.on('routeChangeComplete', change_complete)
    return () => {
      router.events.off('routeChangeComplete', change_complete)
    }
  }, [router])


  return (
  <Fragment><Fragment>
  <Container>
  <Flex sx={{"justifyContent": "space-between"}}>
  <Box>
  <Link as={NextLink} href="/">
  <Image src="/logo.png" sx={{"width": "80px"}}/>
</Link>
</Box>
  <Center>
  <Menu>
  <MenuButton>
  {`MENU`}
</MenuButton>
  <MenuList>
  <Link as={NextLink} href="/aboutpage">
  <MenuItem>
  {`About`}
</MenuItem>
</Link>
  <MenuItem>
  {`Posts`}
</MenuItem>
</MenuList>
</Menu>
</Center>
</Flex>
  <Divider/>
  <SimpleGrid columns={[1, 2]}>
  <Center>
  <Box>
  <Heading>
  {`I'm Demian`}
</Heading>
  <Heading size="sm">
  {`Python Developer`}
</Heading>
  <Button onClick={_e => Event([E("my_state.get_quote", {})], _e)} sx={{"marginTop": "2rem"}}>
  {`Click here`}
</Button>
</Box>
</Center>
  <Center>
  <Image src="/coding.png"/>
</Center>
</SimpleGrid>
  <Divider/>
  <Box>
  <Text as="b">
  {my_state.quote}
</Text>
  <Text>
  {my_state.author}
</Text>
</Box>
</Container>
  <NextHead>
  <title>
  {`Reflex App`}
</title>
  <meta content="A Reflex app." name="description"/>
  <meta content="favicon.ico" property="og:image"/>
</NextHead>
</Fragment>
    </Fragment>
  )
}
