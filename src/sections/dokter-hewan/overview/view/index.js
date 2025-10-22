'use client';

import { useCallback, useState } from 'react';
import { Droppable, DragDropContext } from '@hello-pangea/dnd';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { moveTask, moveColumn, useGetBoard } from 'src/api/kanban';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

import KanbanColumn from '../kanban-column';
import KanbanColumnAdd from '../kanban-column-add';
import { KanbanColumnSkeleton } from '../kanban-skeleton';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const [board, setBoard] = useState({
    columns: {
      '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1': {
        id: '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Laporan Surveilans',
        taskIds: [
          '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
          '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
          '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        ],
      },
      '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2': {
        id: '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Pemeriksaan',
        taskIds: [
          '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
          '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        ],
      },
      '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3': {
        id: '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Hasil Pemeriksaan Dokter',
        taskIds: [],
      },
    },
    tasks: {
      '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1': {
        id: '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        due: [null, null],
        status: 'To Do',
        labels: [],
        comments: [],
        assignee: [],
        priority: 'low',
        attachments: [],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Complete Project Proposal',
        description:
          'Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.',
      },
      '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2': {
        id: '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        due: [1714890208981, 1714976608981],
        status: 'To Do',
        labels: ['Technology'],
        comments: [
          {
            id: 'e834d000-3465-4f44-9772-fe4f2bef3205',
            name: 'Jayvion Simon',
            createdAt: '2024-05-03T06:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
            messageType: 'text',
            message:
              'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
          },
        ],
        assignee: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
          },
        ],
        priority: 'hight',
        attachments: [
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_12.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_13.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_14.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_15.jpg',
        ],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Conduct Market Research',
        description:
          'Atque eaque ducimus minima distinctio velit. Laborum et veniam officiis. Delectus ex saepe hic id laboriosam officia. Odit nostrum qui illum saepe debitis ullam. Laudantium beatae modi fugit ut. Dolores consequatur beatae nihil voluptates rem maiores.',
      },
      '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3': {
        id: '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        due: [1714976608981, 1715063008981],
        status: 'To Do',
        labels: ['Technology', 'Marketing'],
        comments: [
          {
            id: 'e834d000-3465-4f44-9772-fe4f2bef3205',
            name: 'Jayvion Simon',
            createdAt: '2024-05-03T06:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
            messageType: 'text',
            message:
              'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
          },
          {
            id: 'cc1f51d4-c279-4d93-9ccb-5150f942d5f8',
            name: 'Lucian Obrien',
            createdAt: '2024-05-02T05:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_7.jpg',
          },
        ],
        assignee: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
          },
        ],
        priority: 'medium',
        attachments: [],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Design User Interface Mockups',
        description:
          'Rerum eius velit dolores. Explicabo ad nemo quibusdam. Voluptatem eum suscipit et ipsum et consequatur aperiam quia. Rerum nulla sequi recusandae illum velit quia quas. Et error laborum maiores cupiditate occaecati.',
      },
      '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4': {
        id: '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        due: [1715063008981, 1715149408981],
        status: 'In Progress',
        labels: ['Technology', 'Marketing', 'Design'],
        comments: [
          {
            id: 'e834d000-3465-4f44-9772-fe4f2bef3205',
            name: 'Jayvion Simon',
            createdAt: '2024-05-03T06:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
            messageType: 'text',
            message:
              'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
          },
          {
            id: 'cc1f51d4-c279-4d93-9ccb-5150f942d5f8',
            name: 'Lucian Obrien',
            createdAt: '2024-05-02T05:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_7.jpg',
          },
          {
            id: 'fb2b89bf-864d-419c-a895-504b1b85ac35',
            name: 'Deja Brady',
            createdAt: '2024-05-01T04:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',
          },
        ],
        assignee: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
          },
        ],
        priority: 'hight',
        attachments: [],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Develop Backend API',
        description:
          'Et non omnis qui. Qui sunt deserunt dolorem aut velit cumque adipisci aut enim. Nihil quis quisquam nesciunt dicta nobis ab aperiam dolorem repellat. Voluptates non blanditiis. Error et tenetur iste soluta cupiditate ratione perspiciatis et. Quibusdam aliquid nam sunt et quisquam non esse.',
      },
      '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5': {
        id: '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        due: [1715149408981, 1715235808981],
        status: 'In Progress',
        labels: ['Technology', 'Marketing', 'Design', 'Photography'],
        comments: [
          {
            id: 'e834d000-3465-4f44-9772-fe4f2bef3205',
            name: 'Jayvion Simon',
            createdAt: '2024-05-03T06:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
            messageType: 'text',
            message:
              'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
          },
          {
            id: 'cc1f51d4-c279-4d93-9ccb-5150f942d5f8',
            name: 'Lucian Obrien',
            createdAt: '2024-05-02T05:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_7.jpg',
          },
          {
            id: 'fb2b89bf-864d-419c-a895-504b1b85ac35',
            name: 'Deja Brady',
            createdAt: '2024-05-01T04:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',
          },
          {
            id: '0f724398-6eb8-45b7-8f70-d8be414ae124',
            name: 'Harrison Stein',
            createdAt: '2024-04-30T03:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg',
            messageType: 'text',
            message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
          },
        ],
        assignee: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg',
          },
        ],
        priority: 'medium',
        attachments: [],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Implement Authentication System',
        description:
          'Nihil ea sunt facilis praesentium atque. Ab animi alias sequi molestias aut velit ea. Sed possimus eos. Et est aliquid est voluptatem.',
      },
      '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6': {
        id: '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        due: [1715235808981, 1715322208981],
        status: 'Done',
        labels: ['Technology', 'Marketing', 'Design', 'Photography', 'Art'],
        comments: [
          {
            id: 'e834d000-3465-4f44-9772-fe4f2bef3205',
            name: 'Jayvion Simon',
            createdAt: '2024-05-03T06:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
            messageType: 'text',
            message:
              'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
          },
          {
            id: 'cc1f51d4-c279-4d93-9ccb-5150f942d5f8',
            name: 'Lucian Obrien',
            createdAt: '2024-05-02T05:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_7.jpg',
          },
          {
            id: 'fb2b89bf-864d-419c-a895-504b1b85ac35',
            name: 'Deja Brady',
            createdAt: '2024-05-01T04:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
            messageType: 'image',
            message: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',
          },
          {
            id: '0f724398-6eb8-45b7-8f70-d8be414ae124',
            name: 'Harrison Stein',
            createdAt: '2024-04-30T03:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg',
            messageType: 'text',
            message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
          },
          {
            id: '0085e3ac-17bf-47e6-8eb2-85f8c2820754',
            name: 'Reece Chung',
            createdAt: '2024-04-29T02:23:28.981Z',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg',
            messageType: 'text',
            message:
              'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
          },
        ],
        assignee: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg',
          },
        ],
        priority: 'low',
        attachments: [
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_5.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_6.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_7.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',
          'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_9.jpg',
        ],
        reporter: {
          id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
        },
        name: 'Write Test Cases',
        description:
          'Non rerum modi. Accusamus voluptatem odit nihil in. Quidem et iusto numquam veniam culpa aperiam odio aut enim. Quae vel dolores. Pariatur est culpa veritatis aut dolorem.',
      },
    },
    ordered: [
      '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
    ],
  });

  const onDragEnd = useCallback(
    async ({ destination, source, draggableId, type }) => {
      try {
        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return;
        }

        // Moving column
        if (type === 'COLUMN') {
          const newOrdered = [...board.ordered];

          newOrdered.splice(source.index, 1);

          newOrdered.splice(destination.index, 0, draggableId);

          moveColumn(newOrdered);
          return;
        }

        const sourceColumn = board?.columns[source.droppableId];

        const destinationColumn = board?.columns[destination.droppableId];

        // Moving task to same list
        if (sourceColumn.id === destinationColumn.id) {
          const newTaskIds = [...sourceColumn.taskIds];

          newTaskIds.splice(source.index, 1);

          newTaskIds.splice(destination.index, 0, draggableId);

          setBoard({
            ...board,
            columns: {
              ...board?.columns,
              [sourceColumn.id]: {
                ...sourceColumn,
                taskIds: newTaskIds,
              },
            },
          });

          console.info('Moving to same list!');

          return;
        }

        // Moving task to different list
        const sourceTaskIds = [...sourceColumn.taskIds];

        const destinationTaskIds = [...destinationColumn.taskIds];

        // Remove from source
        sourceTaskIds.splice(source.index, 1);

        // Insert into destination
        destinationTaskIds.splice(destination.index, 0, draggableId);

        setBoard({
          ...board,
          columns: {
            ...board?.columns,
            [sourceColumn.id]: {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            },
            [destinationColumn.id]: {
              ...destinationColumn,
              taskIds: destinationTaskIds,
            },
          },
        });

        console.info('Moving to different list!');
      } catch (error) {
        console.error(error);
      }
    },
    [board?.columns, board?.ordered]
  );

  const renderSkeleton = (
    <Stack direction="row" alignItems="flex-start" spacing={3}>
      {[...Array(4)].map((_, index) => (
        <KanbanColumnSkeleton key={index} index={index} />
      ))}
    </Stack>
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 1,
      }}
    >
      {/* <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Kanban
      </Typography> */}

      {/* {boardLoading && renderSkeleton} */}

      {/* {boardEmpty && (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )} */}

      {!!board?.ordered.length && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <Scrollbar
                sx={{
                  height: 1,
                  minHeight: {
                    xs: '80vh',
                    md: 'unset',
                  },
                }}
              >
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={3}
                  direction="row"
                  alignItems="flex-start"
                  sx={{
                    p: 0.25,
                    height: 1,
                  }}
                >
                  {board?.ordered.map((columnId, index) => (
                    <KanbanColumn
                      index={index}
                      key={columnId}
                      column={board?.columns[columnId]}
                      tasks={board?.tasks}
                    />
                  ))}

                  {provided.placeholder}

                  {/* <KanbanColumnAdd /> */}
                </Stack>
              </Scrollbar>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Container>
  );
}
