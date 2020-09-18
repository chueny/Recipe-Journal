import React from "react";
import TableControl from "../DynamicTable/TableControl";


function RecipeHistory({ recipe, flipCard }) {

    return (
        <>
            <div className="d-flex justify-content-between">
                <h2 className="display-2 font-brand-small">
                    {recipe.name}
                </h2>
                <div>
                    <button type="button" className="rb-btn-subtle font-book-italic mr-3 mt-2" onClick={() => flipCard()}>
                        Recipe
                    </button>
                </div>
            </div>
            <span className="divider-color"></span>
            <div >
                <h1 className="rb-btn">History</h1>
                <TableControl comments={recipe.comments} header={true}></TableControl>
            </div>
        </>
    );
}

export default RecipeHistory;
