<h1 align="center">Fashion E-commerce Starter for Medusa 2.0</h1>

<video src="https://github.com/user-attachments/assets/1afe48e4-5a28-4aee-b4bd-e405701d3cc6" controls="controls" muted="muted" playsinline="playsinline"></video>

<p align="center">
  <a href="https://www.figma.com/community/file/1494273775050024009" target="_blank">
    <img src="https://img.shields.io/badge/Figma-Design_Template-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma Design Template" />
  </a>
</p>

The **Fashion E-commerce Starter** is a modern, customizable e-commerce template built with **Medusa 2.0**. Designed around the concept of the sustainable furniture brand **Sofa Society**, this starter showcases the power of new Medusa 2.0 version. With its focus on cutting-edge design, sustainability, and personalization, Sofa Society offers users an elegant shopping experience where they can explore customizable collections, product options, and a streamlined checkout flow.

This starter kit is an ideal solution for developers who need to set up a professional, feature-rich fashion e-commerce store quickly. It comes with a sleek and modern design, customizable collections, an Inspiration page, an About page, and a streamlined checkout process. The storefront is fully responsive and optimized for mobile, tablet, and desktop devices.

<h2>Table of Contents</h2>

- [Features](#features)
- [Roadmap](#roadmap)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
  - [Medusa](#medusa)
  - [Storefront](#storefront)
  - [Meilisearch](#meilisearch)

## Features

- **Sleek, Modern Design**: The storefront boasts a minimalist, contemporary design that perfectly reflects **Sofa Society's** commitment to modern aesthetics and sustainability.
- **Dynamic Materials and Colors**: Add richness to your product offerings by defining **materials** and **colors** for each product. Colors will be displayed using their corresponding hex codes, and each material can have multiple color options. Customers first select a material, then a color, with dynamic pricing based on their choices.
- **Customizable Collections**: Easily customize the content and images for each collection. Each product page also features images and a CTA for the collection it belongs to, which can be personalized as well, creating a fully branded shopping experience.
- **Premade Inspiration Page**: A beautiful, ready-to-use inspiration page helps customers explore the latest trends and styles, showcasing Sofa Society's furniture in real-world settings.
- **About Page**: Share your brand’s story, values, and commitment to sustainability with a pre-built about page that captures the essence of **Sofa Society**.
- **Streamlined Checkout Flow**: The checkout process is designed to be fast, intuitive, and frictionless, providing a seamless shopping experience for your customers from start to finish.
- **Fully Responsive Design**: Optimized for mobile, tablet, and desktop devices, ensuring a smooth, consistent experience across all platforms.
- **Stripe Integration for Payments**: Accept payments effortlessly by integrating **Stripe**. Simply add your Stripe API key to `medusa/.env` and the publishable key to `storefront/.env` to get started.
- **Full E-commerce Functionality**: The starter includes all the essential e-commerce features you need, including product pages, a shopping cart, a checkout process, and order confirmation.
- **Next.js and Tailwind CSS**: Built with **Next.js** v15 app router and **Tailwind CSS**, the starter is highly performant, customizable, and easy to extend with additional features.

## Roadmap
- [x] **Figma Design Template**: This will enable you to easily customize the design of the storefront to match your brand. [View template](https://www.figma.com/community/file/1494273775050024009).
- [x] **Search**: Integration with Meilisearch for a powerful search experience.
- [x] **404 Page**: Custom 404 page for a better user experience.
- [x] **Account Management**: Allow customers to create accounts, view order history, and manage their personal information.
- [x] **Cart Drawer**: Cart drawer that slides in from the side where customers can view and edit their cart items.
- [x] **Email Templates**: Customizable email templates for order confirmation, shipping updates, and more.
- [x] **Infinite Scroll Pagination**: Improve the product discovery experience with infinite scroll pagination on store and collection pages.
- [x] **Resend Integration**: Integration with Resend for sending transactional emails.

## Screenshots

<details open="open">
<summary><strong style="font-size: 1.15rem">Home</strong></summary>

![Home Page](./media/home.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">About</strong></summary>

![About Page](./media/about.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Inspiration</strong></summary>

![Inspiration Page](./media/inspiration.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Collection</strong></summary>

![Collection Page](./media/collection.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Store</strong></summary>

![Store Page](./media/store.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Product</strong></summary>

![Product Page](./media/product.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Cart</strong></summary>

![Cart Page](./media/cart.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Checkout</strong></summary>

![Checkout Page](./media/checkout.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Checkout Review</strong></summary>

![Checkout Review Page](./media/checkout-review.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Order Confirmation</strong></summary>

![Order Confirmation Page](./media/order-confirmation.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Edit Collection</strong></summary>

![Admin - Edit Collection](./media/admin-collection.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Edit Product Type</strong></summary>

![Admin - Edit Product Type](./media/admin-product-type.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Materials</strong></summary>

![Admin - Materials](./media/admin-materials.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Colors</strong></summary>

![Admin - Colors](./media/admin-colors.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Edit Color</strong></summary>

![Admin - Edit Color](./media/admin-edit-color.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Product</strong></summary>

![Admin - Product](./media/admin-product.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Product Missing Color</strong></summary>

![Admin - Product Missing Color](./media/product-missing-color.jpeg)
</details>

<details>
<summary><strong style="font-size: 1.15rem">Admin - Product Add Missing Color</strong></summary>

![Admin - Product Add Missing Color](./media/product-add-missing-color.jpeg)
</details>

## Prerequisites

- Node >= 24
- Yarn >= 3.5 for Medusa, Yarn v1 for Storefront
- Docker and Docker Compose
- Stripe account (for payments)
- httpie

## Quickstart

```bash
git clone git@github.com:Agilo/fashion-starter.git
```

### Medusa

```bash
cd medusa

# Create the .env file
cp .env.template .env

# Install dependencies
yarn

# Spin up the database and Redis
docker-compose up -d

# Build the project
yarn build

# Run the migrations
yarn medusa db:migrate

# Seed the database
yarn seed

# Create an user
yarn medusa user -e "admin@medusa.local" -p "supersecret"

# Start the development server
yarn dev
```

At this point, you should be able to access the Medusa admin at http://localhost:9000/app with the credentials you just created. After logging in, you should go to http://localhost:9000/app/settings/publishable-api-keys, copy the publishable key, and paste it into the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` env variable in the `storefront/.env.local` file.

### Storefront

```bash
cd storefront

# Create the .env.local file
cp .env.template .env.local

# Install dependencies
yarn

# Start the development server
yarn dev
```

You should now be able to access the storefront at http://localhost:8000.

### Meilisearch

```bash
# Get search api key
http --auth "yoursecretmasterkey" --auth-type bearer GET http://localhost:7700/keys
```

You should go to `storefront/.env.local` file and paste obtained key into the `NEXT_PUBLIC_SEARCH_API_KEY` env variable. Also, go to the `backend/.env` file and paste admin key into `MEILISEARCH_API_KEY`

<a href="https://agilo.com" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a4429448-a08a-4f5a-8195-2cea1416ca87">
    <img src="https://github.com/user-attachments/assets/772994f8-32c6-4b27-832f-2660f833fd78">
  </picture>
</a>
