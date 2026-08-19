# Shopping List App

## Objective

Create an organized shopping list app where users can create multiple lists, view them, and perform CRUD operations (create, read, update, delete) on their list items.

## Figma Design

https://www.figma.com/design/NOAH32mrITlMtKicZbfaX0/Shopping-list?node-id=0-1&t=3yEqd2CZG5zDI2Cl-1

## Google drive link
https://drive.google.com/drive/folders/1XMrcFlaTzudvkuDo4Dr6xyABzP6WmwkS?usp=sharing

## Pages

### Register Page
First-time users register by filling in:
- Name
- Surname
- Email address
- Cellphone number
- Password and confirm password

On successful validation, users are redirected to the Login page.

### Login Page
- User enters email and password
- Inputs are validated; if incorrect, an error message is shown

### Home Page
- Logo on the left, search bar in the middle, profile icon on the right
- Empty state shown when no list has been added yet, with a button to add a list

### Profile Page
- Shows the user's name and email address
- Includes settings, editing user info, and a privacy notice

## App Functionality

### Creating and Adding Items to a List
When adding an item, the user fills in:
- Product name
- Quantity
- Optional notes
- Category (food, office items, clothes, etc.)
- Image

### Updating List Details
- Update an item's category, name, or image
- Items can be checked off as "found"

### Deleting a List
- A confirmation window appears with "Cancel" or "Yes Delete" options

### Viewing a List
- Users can view their list(s) and see the items inside

### Sharing a List
- Users can share a list externally via email

### Search and Sorting
- Sort by price, date added, or product name
- The URL updates to reflect the selected sort option

## Error Handling
- Missing required input → "This is required"
- Password not meeting requirements → "Password doesn't meet the requirements"
- Email must include "@" and "."

## Development Order
1. Login page
2. Sign up / Register page
3. Encrypt password data (hashing)

## Pseudocode

### Register

BEGIN
INPUT name
INPUT surname
INPUT email
INPUT cellnumber
INPUT password
INPUT confirm_password
IF name = "" THEN
    DISPLAY("Name is required")
ELSE IF surname = "" THEN
    DISPLAY("Surname is required")
ELSE IF email = "" THEN
    DISPLAY("Email is required")
ELSE IF cellnumber = "" THEN
    DISPLAY("Cell number is required")
ELSE IF password = "" THEN
    DISPLAY("Password is required")
ELSE IF confirm_password = "" THEN
    DISPLAY("Confirm password is required")
ELSE IF password != confirm_password THEN
    DISPLAY("Passwords do not match")
ELSE
    SAVE user(name, surname, email, cellnumber, password, date_registered)
    REDIRECT to login page
END


### Login

BEGIN
INPUT email
INPUT password
IF email = "" OR password = "" THEN
    DISPLAY("This is required")
ELSE
    stored_password = GET password WHERE email = email
    IF stored_password = NULL OR password != stored_password THEN
        DISPLAY("Invalid login details")
    ELSE
        REDIRECT to home page
    ENDIF
END


### Add List

BEGIN
INPUT list_name
IF list_name = "" THEN
    DISPLAY("This is required")
ELSE
    SAVE list(list_name, user_id, date_created)
    REDIRECT to home page
END


### Add Item to List

BEGIN
INPUT product_name
INPUT quantity
INPUT notes (optional)
INPUT category
INPUT image
IF product_name = "" THEN
    DISPLAY("This is required")
ELSE IF quantity = "" OR quantity <= 0 THEN
    DISPLAY("This is required")
ELSE IF category = "" THEN
    DISPLAY("This is required")
ELSE
    SAVE item(list_id, product_name, quantity, notes, category, image, found=false)
    REDIRECT to home page
END


### View List

BEGIN
lists = GET all lists WHERE user_id = user_id
IF lists = EMPTY THEN
    DISPLAY("No list added yet")
ELSE
    DISPLAY(lists)
END


### Update List

BEGIN
INPUT item_id
INPUT new_name
INPUT new_category
INPUT new_image
item = GET item WHERE item_id = item_id
IF item = NULL THEN
    DISPLAY("Item not found")
ELSE
    item.product_name = new_name
    item.category = new_category
    item.image = new_image
    SAVE item
    DISPLAY("Item updated")
END


### Delete List

BEGIN
INPUT list_id
DISPLAY confirmation_window("Are you sure you want to delete this list?")
IF user clicks "Cancel" THEN
    CLOSE confirmation_window
ELSE IF user clicks "Yes Delete" THEN
    DELETE list WHERE list_id = list_id
    REDIRECT to home page
END

