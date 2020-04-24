# Blue Receipt Coding Challenge

My solution to the Blue Receipt coding challenge.

## Challenge

This challenge is about creating several ui core components from the given design.
We are looking for code quality, please follow best practices.
As this components are part of a ui kit which is the foundation for any project, these core components need to be minimalistic, reusable and composable and have good documentation.

[Design file for Figma](docs/BlueReceipt%20Coding%20Challenge.fig)

### - Implement a Checkbox

Should work and act like the native html <input type="checkbox" />

Requirements:

- allows tabbing
- can be checked/unchecked by clicking on label or pressing space when focused
- must be useable in a form (see /CoreUI/Form/Form.stories.tsx)

### - Implement a DropDownMenu that is basically a popup which can be opened and closed

Requirements:

- Should not define the way its opened, but just accept a isOpen flag
- no state handling

### - Implement a Select Box

Should work and act like the native html <select />

Requirements:

- optional placeholder
- displays selected item instead of placeholder
- tabbing & keyboard bavior same as native select
- must be useable in a form (see /CoreUI/Form/Form.stories.tsx)
- can be disabled

### - Implement a Multi Select (with checkboxes)

Should work and act like the native html <select multi=true />

Requirements:

- optional placeholder
- displays selected items instead of placeholder as string seperate by commas (value1, value2, value3)
- tabbing & keyboard bavior same as native select
- must be useable in a form (see /CoreUI/Form/Form.stories.tsx)
- can be disabled

### - Add checkbox, select box and multi select to the form example (/CoreUI/Form/Form.stories.tsx)

Requirements:

- submitting the form should return a dictionary of all form elements with values (in case of multi select the value should be a array of sub values)

## Scripts

### `yarn storybook`

Run Storybook and open it in the default browser

### `yarn build-storybook`

Builds storybook to /public
