import {
  allComponents,
  allGuides,
  allOverviews,
  allSnippets,
  allUtilities,
} from "@/contentlayer"
import { FRAMEWORKS, isFramework, type Framework } from "./framework-utils"

function toParams(str: string | string[]) {
  const slug = Array.isArray(str) ? str : [str]
  return { params: { slug } }
}

export function extractParams(slug: string[]) {
  const [first] = slug
  let result: Framework = "react"
  if (isFramework(first)) {
    result = first
    slug.shift()
  }
  return { framework: result, slug: slug.join("/") }
}

/* -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------*/

export function getComponentPaths() {
  const paths: string[][] = []

  for (const doc of allComponents) {
    paths.push([doc.slug])
    for (const framework of FRAMEWORKS) {
      paths.push([framework, doc.slug])
    }
  }

  return paths.map(toParams)
}

export function getComponentDoc(slug: string) {
  return allComponents.find(
    (post) => post.frontmatter.slug === `/components/${slug}`,
  )
}

/* -----------------------------------------------------------------------------
 * Overview
 * -----------------------------------------------------------------------------*/

export function getOverviewPaths() {
  return allOverviews.map((doc) => `/overview/${doc.slug}`)
}

export function getOverviewDoc(_slug: string | string[]) {
  const slug = Array.isArray(_slug) ? _slug[0] : _slug
  return allOverviews.find(
    (post) => post.frontmatter.slug === `/overview/${slug}`,
  )
}

/* -----------------------------------------------------------------------------
 * Guide
 * -----------------------------------------------------------------------------*/

export function getGuidePaths() {
  return allGuides.map((doc) => `/guides/${doc.slug}`)
}

export function getGuideDoc(slug: string | string[]) {
  return allGuides.find((post) => post.frontmatter.slug === `/guides/${slug}`)
}

/* -----------------------------------------------------------------------------
 * Snippet
 * -----------------------------------------------------------------------------*/

export function getSnippetPaths() {
  return allSnippets.map((doc) => `/snippets/${doc.slug}`)
}

export function getSnippetDoc(slug: string | string[]) {
  return allSnippets.find(
    (snippet) => snippet.frontmatter.slug === `/snippets/${slug}`,
  )
}

/* -----------------------------------------------------------------------------
 * Utility
 * -----------------------------------------------------------------------------*/

export function getUtilityPaths() {
  return allUtilities.map((doc) => `/utilities/${doc.slug}`)
}

export function getUtilityDoc(slug: string | string[]) {
  return allUtilities.find(
    (utility) => utility.frontmatter.slug === `/utilities/${slug}`,
  )
}
