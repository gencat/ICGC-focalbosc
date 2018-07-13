declare type MapData = {

    layers: Array<Object>,
    sources: Array<MapDataSource>

}

declare type MapDatasource = {
	name: string,
	data: Object
}