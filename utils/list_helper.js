const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  
  const favorite = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
if (blogs.length === 0) return null
  const authorCount = _.countBy(blogs, 'author')
  const pairs = _.toPairs(authorCount)
  const [author, blogsCount] = _.maxBy(pairs,([, count]) => count) 

  return {
    author: author,
    blogs: blogsCount
}
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authorLikes = _.groupBy(blogs, 'author')
  const likesCount = _.mapValues(authorLikes, (blogs) => _.sumBy(blogs, 'likes'))
  const [author, likes] = _.maxBy(_.toPairs(likesCount), ([, count]) => count)

  return {
    author: author,
    likes: likes
    }
}


module.exports = {
    totalLikes,
    dummy,
    favoriteBlog,
    mostBlogs,
    mostLikes
}