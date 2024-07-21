import {
  reactExtension, BlockStack, Text, TextBlock, BlockSpacer, Button, Form, Grid, GridItem, TextField, View, useInstructions, useDiscountCodes, useApplyDiscountCodeChange, Link, Modal, useApi
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <FeedbackForm />
));

function FeedbackForm() {
  const applyDiscountChange = useApplyDiscountCodeChange();
  const discounts = useDiscountCodes();
  const instructions = useInstructions();
  const { ui } = useApi();

  const [validationError, setValidationError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (formSuccess) {
      setTimeout(() => {
        setFormSuccess(false);
      }, 1000);
    }
  }, [handleSubmit]);

  // if (!isFormVisible) {
  //   return (
  //     <BlockStack inlineAlignment={"center"} padding={"base"} background={"subdued"} border={"base"} borderWidth={"medium"} borderRadius={"loose"}>
  //       <Text appearance="success">Thank you for your feedback! A 10% discount has been applied to your order!</Text>
  //     </BlockStack>
  //   )
  // }

  // return (
  //   <Form
  //     onSubmit={handleSubmit}
  //   > 
  //     <BlockStack inlineAlignment={"center"} padding={"base"}>
  //       <Text appearance="info" emphasis="bold">Tell us how to do it better!</Text>
  //     </BlockStack>
  //     <Grid
  //       columns={['50%', '50%']}
  //       rows={['auto', 'auto']}
  //       spacing="base"
  //     >
  //       <View>
  //         <TextField
  //           label="First name"
  //           name="first_name"
  //           value={firstName}
  //           required={true}
  //           onChange={handleFirstNameChange}
  //           onInput={clearValidationErrors}
  //           error={validationError}
  //           disabled={loading}
  //         />
  //       </View>
  //       <View>
  //         <TextField
  //           label="Last name (Optional)"
  //           name="last_name"
  //           value={lastName}
  //           onChange={handleLastNameChange}
  //         />
  //       </View>
  //       <GridItem columnSpan={2}>
  //         <TextField 
  //           label="Comment"
  //           name="comment"
  //           value={comment}
  //           multiline={4}
  //           required={true}
  //           onChange={handleCommentChange}
  //           onInput={clearValidationErrors}
  //           error={validationError}
  //           disabled={loading}
  //         />
  //       </GridItem>
  //     </Grid>

  //     <BlockSpacer spacing="base" />
      
  //     <Button 
  //       accessibilityRole="submit"
  //       loading={loading}
  //       children={loading ? 'Submitting...' : 'Submit'}
  //     />

  //     { formError && <Text appearance="critical">{formError}</Text> }
  //     { formSuccess && <Text appearance="success">Feedback submitted successfully!</Text> }

  //   </Form>
  // );

  return (
    <Link
      overlay={
        <Modal
          id="feedback-modal"
          padding
          title="Feedback Form"
        >
          <Form
            onSubmit={handleSubmit}
          > 
            <BlockStack inlineAlignment={"center"} padding={"base"}>
              <Text appearance="info" emphasis="bold">Tell us how to do it better!</Text>
            </BlockStack>
            <Grid
              columns={['50%', '50%']}
              rows={['auto', 'auto']}
              spacing="base"
            >
              <View>
                <TextField
                  label="First name"
                  name="first_name"
                  value={firstName}
                  required={true}
                  onChange={handleFirstNameChange}
                  onInput={clearValidationErrors}
                  error={validationError}
                  disabled={loading}
                />
              </View>
              <View>
                <TextField
                  label="Last name (Optional)"
                  name="last_name"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </View>
              <GridItem columnSpan={2}>
                <TextField 
                  label="Comment"
                  name="comment"
                  value={comment}
                  multiline={4}
                  required={true}
                  onChange={handleCommentChange}
                  onInput={clearValidationErrors}
                  error={validationError}
                  disabled={loading}
                />
              </GridItem>
            </Grid>

            <BlockSpacer spacing="base" />
            
            <Button 
              accessibilityRole="submit"
              loading={loading}
              children={loading ? 'Submitting...' : 'Submit'}
            />

            { formError && <Text appearance="critical">{formError}</Text> }
            { formSuccess && <Text appearance="success">Feedback submitted successfully!</Text> }

          </Form>
          <Button
            onPress={() =>
              ui.overlay.close('my-modal')
            }
          >
            Submit
          </Button>
        </Modal>
      }
    >
      Complete the feedback form
    </Link>
  )

  function handleFirstNameChange(value) {
    setFirstName(value);
  }
  function handleLastNameChange(value) {
    setLastName(value);
  }
  function handleCommentChange(value) {
    setComment(value);
  }
  function clearForm() {
    setFirstName('');
    setLastName('');
    setComment('');
  }
  function clearValidationErrors() {
    setValidationError('');
  }

  async function handleSubmit() {

    let response;

    if (!firstName || !comment) {
      setValidationError('Please fill out all required fields');
      return;
    }

    try {
      setLoading(true);
      response = await fetch('https://billing-experienced-vt-domain.trycloudflare.com/apps/customer-feedback', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, comment }),
      })
      setLoading(false);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      setLoading(false);
    }
  
    if (response.ok) {
      setFormSuccess(true);
      clearForm();
      applyDiscount();
      setIsFormVisible(false);
    } else {
      setFormError('Failed to submit feedback');
    }
  }

  function applyDiscount() {  
    applyDiscountChange({
      type: "addDiscountCode",
      code: "FEEDBACK",
    });
  }
}