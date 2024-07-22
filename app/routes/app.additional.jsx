import {
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Form,
  useIndexResourceState,
  IndexTable,
  Badge,
  useBreakpoints,
  EmptySearchResult,
  FormLayout,
  DropZone,
  Thumbnail,
  Button
} from "@shopify/polaris";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect, useTransition } from "react";

export const loader = async () => {
  let response;
  let feedbacks = [];

  try {
    response = await fetch('https://arising-dsl-terminal-mystery.trycloudflare.com/apps/customer-feedback');
    feedbacks = await response.json();
    feedbacks = feedbacks?.feedbacks
  } catch (error) {
    console.error('Failed to load feedbacks', error);
  }

  return {
    feedbacks
  };
}

export const action = async ({ request }) => {
  console.log('.....Request:', request);
};

export default function AdditionalPage() {

  const { feedbacks } = useLoaderData();

  const [file, setFile] = useState([]);
  const submit = useSubmit();

  const resourceName = {
    singular: 'feedback',
    plural: 'feedbacks',
  };

  
  const {selectedResources, allResourcesSelected, handleSelectionChange} = 
  useIndexResourceState(feedbacks);

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No feedbacks yet'}
      description={'Customers feddback will appear here'}
      withIllustration
    />
  );

  const handleCSVImport = () => {
    console.log('Todo: implement CSV import');
    console.log('Files:', file);
    const reader = new FileReader();
    let result = reader.readAsText(file);
    console.log('Result:', result);
    //submit(files, { method: 'POST' });
  }

  const handleDropZoneClick = useCallback(
    (_dropFile, acceptedFile, _rejectedFile) => {
      setFile(acceptedFile[0]), []
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
    (
      {id, firstName, lastName, feedback, createdAt},
      index,
    ) => (
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
      </IndexTable.Row>
    ),
  );

  const bulkActions = [
    {
      content: 'Generate AI report',
      onAction: () => console.log('Todo: implement bulk AI report'),
    },
    {
      title: 'Export',
      items: [
        {
          content: 'Export as PDF',
          onAction: () => console.log('Todo: implement CSV exporting'),
        }
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
            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={feedbacks.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                {title: 'First name'},
                {title: 'Last name'},
                {title: 'Feedback'},
                {title: 'Date', alignment: 'end'},
              ]}
              bulkActions={bulkActions}
              emptyState={emptyStateMarkup}
              // loading
            >
              {rowMarkup}
            </IndexTable>
            <Form onSubmit={handleCSVImport}>
              <FormLayout>
                <DropZone onDrop={handleDropZoneClick} type="file" allowMultiple={false}>
                  {uploadedFile}
                  {fileUpload}
                </DropZone>
                <Button
                  primary
                  submit
                  disabled={file.length === 0}
                >Import</Button>
              </FormLayout>
            </Form>
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
    </Page>
  );
}