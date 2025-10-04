// lib/slugify.js

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9\-]/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}