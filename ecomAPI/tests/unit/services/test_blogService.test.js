// Unit tests for blogService.
// Each test has an explicit TC_blogService_XXX comment to match the team Test ID rule.

const mockDb = {
  Blog: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  },
  Allcode: {},
  User: {
    findOne: jest.fn(),
  },
  Comment: {
    findAll: jest.fn(),
  },
};

const mockOp = { substring: 'substring' };

jest.mock('../../../src/models/index', () => ({
  __esModule: true,
  default: mockDb,
}));

jest.mock('sequelize', () => ({
  Op: mockOp,
}));

const blogService = require('../../../src/services/blogService');

describe('blogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC_blogService_001: createNewBlog trả lỗi khi thiếu tham số bắt buộc.
  test('TC_blogService_001 - createNewBlog should return missing parameter error', async () => {
    const result = await blogService.createNewBlog({ title: 'Only title' });

    expect(result).toEqual({
      errCode: 1,
      errMessage: 'Missing required parameter !',
    });
    expect(mockDb.Blog.create).not.toHaveBeenCalled();
  });

  // TC_blogService_002: createNewBlog tạo blog thành công với dữ liệu hợp lệ.
  test('TC_blogService_002 - createNewBlog should create blog successfully', async () => {
    const payload = {
      shortdescription: 'Short',
      title: 'My blog',
      contentMarkdown: 'md',
      contentHTML: '<p>md</p>',
      image: 'YmFzZTY0',
      subjectId: 'SUB1',
      userId: 9,
    };
    mockDb.Blog.create.mockResolvedValue({ id: 1 });

    const result = await blogService.createNewBlog(payload);

    expect(mockDb.Blog.create).toHaveBeenCalledWith({
      shortdescription: 'Short',
      title: 'My blog',
      subjectId: 'SUB1',
      statusId: 'S1',
      image: 'YmFzZTY0',
      contentMarkdown: 'md',
      contentHTML: '<p>md</p>',
      userId: 9,
      view: 0,
    });
    expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
  });

  // TC_blogService_003: getDetailBlogById trả lỗi khi thiếu id.
  test('TC_blogService_003 - getDetailBlogById should return missing parameter error', async () => {
    const result = await blogService.getDetailBlogById();

    expect(result).toEqual({
      errCode: 1,
      errMessage: 'Missing required parameter !',
    });
  });

  // TC_blogService_004: getDetailBlogById tăng lượt xem và trả dữ liệu chi tiết đã enrich.
  test('TC_blogService_004 - getDetailBlogById should increase view and return detail data', async () => {
    const blogInstance = { view: 4, save: jest.fn().mockResolvedValue(undefined) };
    const blogRaw = { id: 2, userId: 5, image: Buffer.from('img').toString('base64') };

    mockDb.Blog.findOne
      .mockResolvedValueOnce(blogInstance)
      .mockResolvedValueOnce(blogRaw);
    mockDb.User.findOne.mockResolvedValue({ id: 5, name: 'U1' });

    const result = await blogService.getDetailBlogById(2);

    expect(blogInstance.view).toBe(5);
    expect(blogInstance.save).toHaveBeenCalled();
    expect(mockDb.Blog.findOne).toHaveBeenNthCalledWith(1, { where: { id: 2 }, raw: false });
    expect(mockDb.Blog.findOne).toHaveBeenNthCalledWith(2, {
      where: { id: 2 },
      include: [{ model: mockDb.Allcode, as: 'subjectData', attributes: ['value', 'code'] }],
      raw: true,
      nest: true,
    });
    expect(result.errCode).toBe(0);
    expect(result.data.userData).toEqual({ id: 5, name: 'U1' });
  });

  // TC_blogService_005: getAllBlog trả danh sách blog và enrich user/comment.
  test('TC_blogService_005 - getAllBlog should return list with userData and commentData', async () => {
    const rows = [
      { id: 1, userId: 11, image: Buffer.from('a').toString('base64'), title: 'A' },
    ];
    mockDb.Blog.findAndCountAll.mockResolvedValue({ rows, count: 1 });
    mockDb.User.findOne.mockResolvedValue({ id: 11, name: 'User11' });
    mockDb.Comment.findAll.mockResolvedValue([{ id: 100, blogId: 1 }]);

    const result = await blogService.getAllBlog({ limit: 10, offset: 0, keyword: '', subjectId: '' });

    expect(mockDb.Blog.findAndCountAll).toHaveBeenCalled();
    expect(result).toEqual({
      errCode: 0,
      data: [
        expect.objectContaining({
          id: 1,
          userData: { id: 11, name: 'User11' },
          commentData: [{ id: 100, blogId: 1 }],
        }),
      ],
      count: 1,
    });
  });

  // TC_blogService_006: updateBlog trả lỗi khi thiếu tham số bắt buộc.
  test('TC_blogService_006 - updateBlog should return missing parameter error', async () => {
    const result = await blogService.updateBlog({ id: 1, title: 'x' });

    expect(result).toEqual({
      errCode: 1,
      errMessage: 'Missing required parameter !',
    });
  });

  // TC_blogService_007: updateBlog cập nhật thành công khi tìm thấy blog.
  test('TC_blogService_007 - updateBlog should update and save blog', async () => {
    const blogInstance = { save: jest.fn().mockResolvedValue(undefined) };
    mockDb.Blog.findOne.mockResolvedValue(blogInstance);

    const payload = {
      id: 7,
      title: 'Updated',
      contentMarkdown: 'new md',
      contentHTML: '<p>new</p>',
      image: 'img64',
      subjectId: 'SUB2',
      shortdescription: 'updated short',
    };

    const result = await blogService.updateBlog(payload);

    expect(mockDb.Blog.findOne).toHaveBeenCalledWith({ where: { id: 7 }, raw: false });
    expect(blogInstance.title).toBe('Updated');
    expect(blogInstance.subjectId).toBe('SUB2');
    expect(blogInstance.save).toHaveBeenCalled();
    expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
  });

  // TC_blogService_008: deleteBlog trả lỗi khi thiếu id.
  test('TC_blogService_008 - deleteBlog should return missing parameter error', async () => {
    const result = await blogService.deleteBlog({});

    expect(result).toEqual({
      errCode: 1,
      errMessage: 'Missing required parameter !',
    });
  });

  // TC_blogService_009: deleteBlog xóa thành công khi blog tồn tại.
  test('TC_blogService_009 - deleteBlog should destroy existing blog', async () => {
    mockDb.Blog.findOne.mockResolvedValue({ id: 4 });
    mockDb.Blog.destroy.mockResolvedValue(1);

    const result = await blogService.deleteBlog({ id: 4 });

    expect(mockDb.Blog.findOne).toHaveBeenCalledWith({ where: { id: 4 } });
    expect(mockDb.Blog.destroy).toHaveBeenCalledWith({ where: { id: 4 } });
    expect(result).toEqual({ errCode: 0, errMessage: 'ok' });
  });

  // TC_blogService_010: getFeatureBlog trả dữ liệu blog nổi bật theo view.
  test('TC_blogService_010 - getFeatureBlog should return featured blogs', async () => {
    const rows = [{ id: 1, userId: 1, image: Buffer.from('x').toString('base64') }];
    mockDb.Blog.findAll.mockResolvedValue(rows);
    mockDb.User.findOne.mockResolvedValue({ id: 1 });
    mockDb.Comment.findAll.mockResolvedValue([{ id: 10 }]);

    const result = await blogService.getFeatureBlog({ limit: 3 });

    expect(mockDb.Blog.findAll).toHaveBeenCalledWith(expect.objectContaining({
      order: [['view', 'DESC']],
      limit: 3,
    }));
    expect(result).toEqual({
      errCode: 0,
      data: [expect.objectContaining({ id: 1, userData: { id: 1 }, commentData: [{ id: 10 }] })],
    });
  });

  // TC_blogService_011: getNewBlog trả dữ liệu blog mới nhất theo createdAt.
  test('TC_blogService_011 - getNewBlog should return newest blogs', async () => {
    const rows = [{ id: 2, userId: 2, image: Buffer.from('y').toString('base64') }];
    mockDb.Blog.findAll.mockResolvedValue(rows);
    mockDb.User.findOne.mockResolvedValue({ id: 2 });
    mockDb.Comment.findAll.mockResolvedValue([{ id: 20 }]);

    const result = await blogService.getNewBlog({ limit: 5 });

    expect(mockDb.Blog.findAll).toHaveBeenCalledWith(expect.objectContaining({
      order: [['createdAt', 'DESC']],
      limit: 5,
    }));
    expect(result).toEqual({
      errCode: 0,
      data: [expect.objectContaining({ id: 2, userData: { id: 2 }, commentData: [{ id: 20 }] })],
    });
  });

  // TC_blogService_012: createNewBlog reject khi DB throw exception.
  test('TC_blogService_012 - createNewBlog should reject when Blog.create throws', async () => {
    const payload = {
      shortdescription: 'Short',
      title: 'My blog',
      contentMarkdown: 'md',
      contentHTML: '<p>md</p>',
      image: 'YmFzZTY0',
      subjectId: 'SUB1',
      userId: 9,
    };
    mockDb.Blog.create.mockRejectedValue(new Error('db error'));

    await expect(blogService.createNewBlog(payload)).rejects.toThrow('db error');
  });
});
