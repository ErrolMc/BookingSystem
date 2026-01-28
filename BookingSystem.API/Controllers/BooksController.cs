using BookingSystem.API.Models;
using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _bookService;

    public BooksController(BookService bookService)
    {
        _bookService = bookService;
    }

    /// <summary>
    /// Get all books
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<Book>>> Get()
    {
        var books = await _bookService.GetAsync();
        return Ok(books);
    }

    /// <summary>
    /// Get a specific book by id
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> Get(string id)
    {
        var book = await _bookService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    /// <summary>
    /// Create a new book
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Book>> Post(Book newBook)
    {
        await _bookService.CreateAsync(newBook);
        return CreatedAtAction(nameof(Get), new { id = newBook.Id }, newBook);
    }

    /// <summary>
    /// Update an existing book
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Book updatedBook)
    {
        var book = await _bookService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        updatedBook.Id = book.Id;

        await _bookService.UpdateAsync(id, updatedBook);

        return NoContent();
    }

    /// <summary>
    /// Delete a book
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _bookService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        await _bookService.RemoveAsync(id);

        return NoContent();
    }
}
