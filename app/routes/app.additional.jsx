import {
  Card, Layout, Link, List, Page, Text, BlockStack, Form, useIndexResourceState, IndexTable, Badge, useBreakpoints, EmptySearchResult, FormLayout, DropZone, Thumbnail, Toast,
  TextField,
  Button
} from "@shopify/polaris";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { TitleBar, Modal } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import Papa from 'papaparse';
import emailjs from '@emailjs/browser';

export const loader = async () => {
  let response;
  let feedbacks = [];

  try {
    response = await fetch('https://leather-clients-dp-snap.trycloudflare.com/apps/customer-feedback');
    feedbacks = await response.json();
    feedbacks = feedbacks?.feedbacks;
  } catch (error) {
    console.error('Failed to load feedbacks', error);
  }

  return {
    feedbacks
  };
};

export const action = async ({ request }) => {
  try {
    const formData = await request.json();
    const response = await fetch('https://leather-clients-dp-snap.trycloudflare.com/apps/customer-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.results),
    });
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response('Failed to parse JSON', { status: 400 });
  }
};

export default function AdditionalPage() {
  const { feedbacks } = useLoaderData();
  const request = useActionData();

  const [file, setFile] = useState([]);
  const [results, setResults] = useState([]);
  const [croEmail, setCroEmail] = useState('admin@dtcpages.com');
  const [croSubject, setCroSubject] = useState('CRO Report');
  const [croNotes, setCroNotes] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const submit = useSubmit();

  const resourceName = {
    singular: 'feedback',
    plural: 'feedbacks',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(feedbacks);

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No feedbacks yet'}
      description={'Customers feedback will appear here'}
      withIllustration
    />
  );

  const handleCSVImport = () => {
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const csvContent = e.target.result;
        const results = await parseCSV(csvContent);
        setResults(results);
        submit({ results: results }, { method: "post", encType: "application/json" });
      } catch (error) {
        console.error('Failed to parse CSV', error);
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (csv) => {
    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results && results.data) {
            resolve(results.data);
          } else {
            reject(new Error('Failed to parse CSV'));
          }
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  };

  const handleDropZoneClick = useCallback(
    (_dropFile, acceptedFile, _rejectedFile) => {
      setFile(acceptedFile[0]), [];
    },
    [],
  );

  const validFileTypes = ['.ms-excel', '.csv'];

  const fileUpload = !file.length && (
    <DropZone.FileUpload actionHint="Accepts .csv" />
  );

  const uploadedFile = file && (
    <BlockStack>
      <Thumbnail
        size="small"
        alt={file.name}
        source="https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png"
      />
      <Text>{file.name}</Text>
      <Badge>{file.size} bytes</Badge>
    </BlockStack>
  );

  const rowMarkup = feedbacks.map(
    ({ id, firstName, lastName, feedback, createdAt, rating }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {firstName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{lastName}</IndexTable.Cell>
        <IndexTable.Cell>{feedback}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{rating}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const bulkActions = [
    {
      content: 'Generate AI report',
      onAction: () => console.log('Todo: implement bulk AI report'),
    },
    {
      content: 'Professional CRO Report',
      onAction: () => shopify.modal.show('cro-email'),
    },
    {
      title: 'Export',
      items: [
        {
          content: 'Export as PDF',
          onAction: () => console.log('Todo: implement CSV exporting'),
        },
      ],
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: 'Delete feedbacks',
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={feedbacks.length}
                selectedItemsCount={
                  allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: 'First name' },
                  { title: 'Last name' },
                  { title: 'Feedback' },
                  { title: 'Date', alignment: 'end' },
                  { title: 'Rating', alignment: 'center' }
                ]}
                bulkActions={bulkActions}
                emptyState={emptyStateMarkup}
              // loading
              >
                {rowMarkup}
              </IndexTable>
            
              <DropZone onDrop={handleCSVImport} type="file" allowMultiple={false} variableHeight>
                <DropZone.FileUpload actionTitle="Import Feedback" actionHint=".CSV files only"/>
              </DropZone>
            </BlockStack>
            
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <Modal id="cro-email" variant="base">
        <TitleBar title="Contact our CRO Team"/>
        <Form>
          <FormLayout>
            <TextField
              type="email"
              value={croEmail}
              label="To"
              disabled
              size="slim"
            />
            <TextField
              label="From"
              type="email"
              tone="magic"
              value={clientEmail}
              onChange={(value) => setClientEmail(value)}
            />
            <TextField
              label="Subject"
              type="text"
              value={croSubject}
              onChange={(value) => setCroSubject(value)}
            />
            <TextField 
              label="Additional notes"
              type="text"
              multiline
              spellCheck
              value={croNotes}
              onChange={(value) => setCroNotes(value)}
            />
            <Button
              submit
              fullWidth
            >
              Send
            </Button>
          </FormLayout>
        </Form>
      </Modal>
    </Page>
  );
}