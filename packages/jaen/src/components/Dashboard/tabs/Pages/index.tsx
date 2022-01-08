import {AddIcon, DeleteIcon, ViewIcon} from '@chakra-ui/icons'
import {Box, Divider, Flex} from '@chakra-ui/layout'
import {Button, ButtonGroup, IconButton} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import * as React from 'react'

import {TreeNode} from '@src/utils/hooks/jaen/useJaenPageTree'

import {ContentValues, PageContent} from './PageContent'
import PageTree, {PageTreeProps} from './PageTree'

export interface PagesTabProps extends PageTreeProps {
  getPage: (id: string) => TreeNode
  onPageUpdate: (id: string, values: ContentValues) => void
}

/**
 * PagesTab is a component for displaying the page tree with content in the dashboard.
 * Display PageTree and PageContent next to each other.
 */
const PagesTab = (props: PagesTabProps) => {
  const [selection, setSelection] = React.useState<TreeNode | null>(null)

  const onSelect = (id: string | null) => {
    if (id !== null) {
      const page = props.getPage(id)
      setSelection(page)
    } else {
      setSelection(null)
    }
  }

  const handlePageUpdate = React.useCallback(
    (values: ContentValues) =>
      selection && props.onPageUpdate(selection.id, values),
    [selection]
  )

  const selectedTemplate = React.useMemo(
    () =>
      props.templates.find(t => t.name === selection?.template?.name) || null,
    [props.templates, selection?.template?.name]
  )

  return (
    <div>
      <Button onClick={() => navigate('/')}>Site</Button>
      <Flex>
        <Box h="70vh" w="35%">
          <>
            <ButtonGroup size="sm">
              <IconButton
                aria-label="Add a subpage to the selected page"
                icon={<AddIcon />}
                disabled
              />
              <IconButton
                aria-label="Delete the selected page"
                icon={<DeleteIcon />}
                onClick={() => {
                  props.onItemDelete(selection!.id)

                  setSelection(null)
                }}
                disabled={!selection?.template}
              />
              <IconButton
                aria-label="Navigate to the page"
                icon={<ViewIcon />}
                onClick={() => props.onItemDoubleClick(selection?.id!)}
                disabled={!selection}
              />
            </ButtonGroup>
            <PageTree
              items={props.items}
              templates={props.templates}
              creatorFallbackTemplates={props.creatorFallbackTemplates}
              onItemSelect={onSelect}
              onItemDoubleClick={props.onItemDoubleClick}
              onItemCreate={props.onItemCreate}
              onItemDelete={props.onItemDelete}
              onItemMove={props.onItemMove}
            />
          </>
        </Box>
        <Divider orientation="vertical" />
        <Box flex={1}>
          {selection ? (
            <PageContent
              key={selection.id}
              template={selectedTemplate}
              values={{
                title: selection.jaenPageMetadata.title,
                slug: selection.slug,
                description: selection.jaenPageMetadata.description
              }}
              onSubmit={handlePageUpdate}
            />
          ) : (
            <p>Select a page to view its content.</p>
          )}
        </Box>
      </Flex>
    </div>
  )
}

export default PagesTab
