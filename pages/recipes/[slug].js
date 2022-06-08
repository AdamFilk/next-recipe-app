import { PortableText } from "@portabletext/react";
import { useState } from "react";
import { sanityClient, urlFor, usePreview } from "../../lib/sanity";
import { useRouter } from "next/router";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      mainImage,
      ingrediant[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingrediant->{
          name
        }
      },
      instructions,
      likes
    }`;

export default function OneRecipe({ data, preview }) {
  const { data: recipe } = usePreview(recipeQuery, {
    params: { slug: data.recipe?.slug.current },
    initialData: data,
    enabled: preview,
  });

  const [likes, setLikes] = useState(data?.recipe?.likes);

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: data?.recipe?._id }),
    }).catch((error) => console.log(error));

    const data = await res.json();

    setLikes(data.likes);
  };
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <article className="recipe">
      <h1>{data.recipe.name}</h1>

      <button className="like-button" onClick={addLike}>
        {likes} ❤️
      </button>

      <main className="content">
        <img
          src={urlFor(data.recipe?.mainImage).url()}
          alt={data.recipe.name}
        />
        <div className="breakdown">
          <ul className="ingredients">
            {data.recipe.ingrediants?.map((ingrediant) => (
              <li key={ingrediant._key} className="ingredient">
                {ingrediant?.wholeNumber}
                {ingrediant?.fraction} {ingrediant?.unit}
                <br />
                {ingrediant?.ingrediant?.name}
              </li>
            ))}
          </ul>
          <PortableText
            value={data.recipe?.instructions}
            className="instructions"
          />
        </div>
      </main>
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe }, preview: true } };
}
