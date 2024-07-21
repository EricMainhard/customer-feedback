import {
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  useIndexResourceState,
  IndexTable,
  Badge,
  useBreakpoints,
  EmptySearchResult
} from "@shopify/polaris";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";

export const loader = async () => {
  let response;
  let feedbacks = [];

  try {
    response = await fetch('https://billing-experienced-vt-domain.trycloudflare.com/apps/customer-feedback');
    feedbacks = await response.json();
    feedbacks = feedbacks?.feedbacks
  } catch (error) {
    console.error('Failed to load feedbacks', error);
  }

  return {
    feedbacks
  };
}

export default function AdditionalPage() {

  const { feedbacks } = useLoaderData();

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
            {createdAt}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const promotedBulkActions = [
    {
      content: 'Create shipping labels',
      onAction: () => console.log('Todo: implement create shipping labels'),
    },
    {
      content: 'Mark as fulfilled',
      onAction: () => console.log('Todo: implement mark as fulfilled'),
    },
    {
      content: 'Capture payment',
      onAction: () => console.log('Todo: implement capture payment'),
    },
  ];
  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      title: 'Import',
      items: [
        {
          content: 'Import from PDF',
          onAction: () => console.log('Todo: implement PDF importing'),
        },
        {
          content: 'Import from CSV',
          onAction: () => console.log('Todo: implement CSV importing'),
        },
      ],
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: 'Delete customers',
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
              promotedBulkActions={promotedBulkActions}
              emptyState={emptyStateMarkup}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
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