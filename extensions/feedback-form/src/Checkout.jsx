import {
  reactExtension, BlockStack, Text, InlineStack, BlockSpacer, Button, Form, Grid, GridItem, TextField, View, useInstructions, useDiscountCodes, useApplyDiscountCodeChange, Link, Modal, useApi, useSettings, Icon
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
  const { modal } = useSettings();

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
      const timer = setTimeout(() => {
        setFormSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formSuccess]);

  function handleFirstNameChange(value) {
    setFirstName(value);
  }

  function handleLastNameChange(value) {
    setLastName(value);
  }

  function handleCommentChange(value) {
    setComment(value);
  }

  function handleValidationErrors(value) {
    setValidationError(value);
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
    setFormError('');

    if (!firstName || !comment) {
      setValidationError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://leather-clients-dp-snap.trycloudflare.com/apps/feedback-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, comment }),
      });

      setLoading(false);

      if (response.ok){
        let res = await response.json();
        console.log(res);
      }

      /*if (response.ok) {
        setFormSuccess(true);
        if (modal) {
          ui.overlay.close('feedback-modal');
        }
        clearForm();
        applyDiscount();
        setIsFormVisible(false);
      } else {
        setFormError('Failed to submit feedback');
      }*/
    } catch (error) {
      console.error('Failed to submit feedback', error);
      setFormError('Failed to submit feedback');
      setLoading(false);
    }
  }

  function applyDiscount() {
    applyDiscountChange({
      type: "addDiscountCode",
      code: "FEEDBACK",
    });
  }

  return (
    modal ? (
      <Link
        overlay={
          <Modal
            id="feedback-modal"
            padding
            title="Feedback Form"
          >
            <FormElement
              submitFunction={handleSubmit} 
              modal={true}
              firstName={firstName}
              lastName={lastName}
              comment={comment}
              validationError={validationError}
              formError={formError}
              formSuccess={formSuccess}
              loading={loading}
              handleFirstNameChange={handleFirstNameChange}
              handleLastNameChange={handleLastNameChange}
              handleCommentChange={handleCommentChange}
              handleValidationErrors={handleValidationErrors}
            />
          </Modal>
        }
      >
        Complete the feedback form
      </Link>
    ) : (
      <FormElement 
        submitFunction={handleSubmit} 
        modal={false}
        firstName={firstName}
        lastName={lastName}
        comment={comment}
        validationError={validationError}
        formError={formError}
        formSuccess={formSuccess}
        loading={loading}
        handleFirstNameChange={handleFirstNameChange}
        handleLastNameChange={handleLastNameChange}
        handleCommentChange={handleCommentChange}
        handleValidationErrors={handleValidationErrors}
      />
    )
  );
}

function FormElement({
  submitFunction, 
  modal,
  firstName,
  lastName,
  comment,
  validationError,
  formError,
  formSuccess,
  loading,
  handleFirstNameChange,
  handleLastNameChange,
  handleCommentChange,
  handleValidationErrors
}) {
  return (
    <Form onSubmit={submitFunction}>
      <BlockStack inlineAlignment={"center"} padding={"base"}>
        <Text appearance="info" emphasis="bold">Tell us how to do it better!</Text>
      </BlockStack>
      <Grid columns={['50%', '50%']} rows={['auto', 'auto']} spacing="base">
        <View>
          <TextField
            label="First name"
            name="first_name"
            value={firstName}
            required
            onChange={(value) => handleFirstNameChange(value)}
            onInput={() => handleValidationErrors('')}
            error={validationError}
            disabled={loading}
          />
        </View>
        <View>
          <TextField
            label="Last name (Optional)"
            name="last_name"
            value={lastName}
            onChange={(value) => handleLastNameChange(value)}
          />
        </View>
        <GridItem columnSpan={2}>
          <TextField
            label="Comment"
            name="comment"
            value={comment}
            multiline={4}
            required
            onChange={(value) => handleCommentChange(value)}
            onInput={() => handleValidationErrors('')}
            error={validationError}
            disabled={loading}
          />
        </GridItem>
      </Grid>
      <BlockSpacer spacing="base" />
      <BlockStack>
        <Button
          accessibilityRole="submit"
          loading={loading}
          children={loading ? 'Submitting...' : 'Submit'}
        />

        {formError && (
          <InlineStack blockAlignment="center">
            <Icon source="critical" appearance="critical"/>
            <Text appearance="critical"> {formError} </Text>
          </InlineStack>
        )}
        {formSuccess && (
          <InlineStack blockAlignment="center">
            <Icon source="success" appearance="success"/>
            <Text appearance="success">Feedback submitted successfully!</Text>
          </InlineStack>
        )}
        
      </BlockStack>
    </Form>
  );
}