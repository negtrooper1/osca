import Meta from '../components/Meta'
import { Container } from '../components/Container'
import { Flex, Stack, Text, Divider } from '@chakra-ui/react'
import Header from '../components/Header'
import { useState } from 'react'
import { useSession } from 'next-auth/client'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"

const Admin = (props) => {
  let [session, loading] = useSession();
  const [entries, setEntries] = useState([]);

  if (session && session.user) {
    if (!entries.length) {
      loading = true
      hit('/api/lottery/entries')
        .then(data => {
          console.log(data)
          if (data.length) setEntries(data)
          console.log(entries)
        })
        .catch(err => console.log(err));
    } else {
      loading = false
    }
  }

  return (
    <>
      <Meta title={"OSCAdmin"} />
      <Header />
      <Flex>
        <Stack bgColor="gray.100" w="20vw" direction="column" py={8} px={4}>
          <Text textAlign="center">OSCAdmin</Text>
          <Divider />
        </Stack>
        <Container w="80vw" minHeight="100vh">
          <Table variant="simple">
            <TableCaption>Current lottery entries</TableCaption>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Timestamp</Th>
                <Th>EntryId</Th>
                <Th>First</Th>
                <Th>Last</Th>
              </Tr>
            </Thead>
            <Tbody>
              {entries.map(entry => (
                <Tr key={entry.entryId}>
                  <Td>{entry.email}</Td>
                  <Td>{entry.timestamp}</Td>
                  <Td>{entry.entryId}</Td>
                  <Td>{entry.entryMetadata.firstName}</Td>
                  <Td>{entry.entryMetadata.lastName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Flex>
    </>
  )
}

async function hit(...args) {
  return fetch(...args).then(x => x.json())
}

export default Admin