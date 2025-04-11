const props = {
	material: {
		thickness = 18,
		edging = 2,
	},
	sizes: {
		width = 600,
		height = 2000,
		depth = 300,
	},
	columns: [
		{
			width = '100%', //  mm, %
			shelves = [
				{
					height = 320,
					fromBottom,
					fromTop,
					isFixed = false,
				}
			],
		},
	],
	features: {

	},
};

function calcCabinet(props) {
	const box = calcBox(props);
	
}

function calcBox(props) {
	const { material, sizes, columns, features } = props;
	const boards = [];
	const halfTh = material.thickness / 2;
	const pinFromBack = sizes.depth * 0.2;
	const pinFromFace = sizes.depth * 0.2;
	const pinDepth = halfTh;
	const edging = {
		left: { thickness: material.edging },
		right: { thickness: material.edging },
		bottom: { thickness: material.edging },
	},

	const generalProps = {
		description: 'Pin',
		depth: pinDepth,
		diameter: 8,
	};

	const topBoard = {
		description: 'Top',
		width: sizes.width,
		height: sizes.depth,
		holes: [
			{
				...generalProps,
				side: 'bottom',
				left: halfTh,
				top: pinFromBack,
			},
			{
				...generalProps,
				side: 'bottom',
				left: halfTh,
				bottom: pinFromFace,
			},
			{
				...generalProps,
				side: 'bottom',
				right: halfTh,
				top: pinFromBack,
			},
			{
				...generalProps,
				side: 'bottom',
				right: halfTh,
				bottom: pinFromFace,
			},
		],
	};

	const bottomBoard = {
		description: 'Bottom',
		width: sizes.width,
		height: sizes.depth,
		holes: [
			{
				...generalProps,
				side: 'top',
				left: halfTh,
				top: pinFromBack,
			},
			{
				...generalProps,
				side: 'top',
				left: halfTh,
				bottom: pinFromFace,
			},
			{
				...generalProps,
				side: 'top',
				right: halfTh,
				top: pinFromBack,
			},
			{
				...generalProps,
				side: 'top',
				right: halfTh,
				bottom: pinFromFace,
			},
		],
	};

	const verticalBoardWidth = sizes.height - 2 * material.thickness;
	const verticalBoardHeight = sizes.depth;
	const verticalBoardGeneral = {
		width: verticalBoardWidth,
		height: verticalBoardHeight,
		edging: {
			bottom: { thickness: material.edging },
		},
	};

	const verticalBoardHoles = {

	};

	const verticalBoards = [
		{
			description: 'Vertical 1',
			...verticalBoardGeneral,
		},
	];

	columns.forEach( (col, i) => {
		const leftBoard = verticalBoards[verticalBoards.length - 1];
		const rightBoard = {
			description: `Vertical ${i+2}`,
			...verticalBoardGeneral,
		},
		// add pinholes
		verticalBoards.push(rightBoard);
	});



	return [
		topBoard, bottomBoard, ...verticalBoards
	];
}