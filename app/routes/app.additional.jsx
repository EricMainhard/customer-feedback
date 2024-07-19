import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  DataTable
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";

export const loader = async () => {
  let response;
  let feedbacks = [];

  try {
    response = await fetch('https://respondents-attraction-epson-contractor.trycloudflare.com/apps/customer-feedback');
    feedbacks = await response.json();
    console.log("Feedback data fetched successfully:", feedbacks);
  } catch (error) {
    console.error('Failed to load feedbacks', error);
  }

  return {
    feedbacks
  };
}

export default function AdditionalPage() {

  const { feedbacks } = useLoaderData();
  const [sortedRows, setSortedRows] = useState([]);

  useEffect(() => {
    if (feedbacks && feedbacks.length > 0) {
      const initiallySortedRows = feedbacks.map(fb => {
        return [
          fb.firstName,
          fb.lastName,
          fb.feedback,
          fb.createdAt
        ];
      });
      setSortedRows(initiallySortedRows);
      console.log("Initial sorted rows set:", initiallySortedRows);
    } else {
      console.warn("No feedbacks available");
    }
  }, [feedbacks]);

  const sortDates = (rows, index, direction) => {
    rows.map(row => {
      console.log('...', row[index]);
    });
    return [...rows].sort((rowA, rowB) => {
      const dateA = new Date(rowA[index]);
      const dateB = new Date(rowB[index]);

      return direction === 'descending' ? dateB - dateA : dateA - dateB;
    });
  }
    
  const rows = sortedRows ? sortedRows : initiallySortedRows;

  const handleSort = useCallback(
    (index, direction) =>
      setSortedRows(sortDates(rows, index, direction)),
    [rows],
  );

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text'
            ]}
            headings={[
              'First name',
              'Last name',
              'Feedback',
              'Date'
            ]}
            sortable={[false, false, false, true]}
            rows={rows}
            defaultSortDirection="descending"
            onSort={handleSort}
            initialSortColumnIndex={3}
            footerContent={`Showing ${rows.length} of ${rows.length} results`}
          >
          </DataTable>
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