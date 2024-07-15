import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async () => {
  let response;
  let feedbacks = [];

  try {
    response = await fetch('https://batman-cellular-receives-collective.trycloudflare.com/apps/customer-feedback');
    feedbacks = await response.json();
  } catch (error) {
    console.error('Failed to load feedbacks', error);
  }

  return {
    feedbacks
  };
}

function FeedbackItem({ feedback }) {

  console.log(feedback);

  return (
    <Box>
      <Text>{feedback.firstName} {feedback.lastName}</Text>
      <Text>{feedback.feedback}</Text>
      <Text>{Date(feedback.createdAt)}</Text>
    </Box>
  )
}

export default function AdditionalPage() {

  const { feedbacks } = useLoaderData();

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              {feedbacks.feedbacks.map(fb => (
                <FeedbackItem key={fb.id} feedback={fb}/>
              ))}
            </BlockStack>
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

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
