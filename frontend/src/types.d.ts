declare module "*.svg" {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// images
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
