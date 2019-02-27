import DocumentNode from '../renderer/DocumentNode'
import { trace } from '../util'

import CommentNode from '../renderer/CommentNode'
import ElementNode from '../renderer/ElementNode'
import ViewNode from '../renderer/ViewNode'
import TextNode from '../renderer/TextNode'

export {CommentNode, ElementNode, ViewNode, TextNode}

export const namespaceMap = {}

export function createElement(tagName, vnode) {
  trace(`CreateElement(${tagName})`)
  return DocumentNode.createElement(tagName)
}

export function createElementNS(namespace, tagName) {
  trace(`CreateElementNS(${namespace}#${tagName})`)
  return DocumentNode.createElementNS(namespace, tagName)
}

export function createTextNode(text) {
  trace(`CreateTextNode(${text})`)
  return DocumentNode.createTextNode(text)
}

export function createComment(text) {
  trace(`CreateComment(${text})`)

  return DocumentNode.createComment(text)
}

export function insertBefore(parentNode, newNode, referenceNode) {
  trace(`InsertBefore(${parentNode}, ${newNode}, ${referenceNode})`)
  return parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild(node, child) {
  trace(`RemoveChild(${node}, ${child})`)
  return node.removeChild(child)
}

export function appendChild(node, child) {
  trace(`AppendChild(${node}, ${child})`)

  return node.appendChild(child)
}

export function parentNode(node) {
  trace(`ParentNode(${node}) -> ${node.parentNode}`)

  return node.parentNode
}

export function nextSibling(node) {
  trace(`NextSibling(${node}) -> ${node.nextSibling}`)

  return node.nextSibling
}

export function tagName(elementNode) {
  trace(`TagName(${elementNode}) -> ${elementNode.tagName}`)

  return elementNode.tagName
}

export function setTextContent(node, text) {
  trace(`SetTextContent(${node}, ${text})`)

  node.setText(text)
}

export function setAttribute(node, key, val) {
  trace(`SetAttribute(${node}, ${key}, ${val})`)

  node.setAttribute(key, val)
}

export function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '')
}
