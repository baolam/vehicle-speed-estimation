from collections import defaultdict

# Chương trình của chatGPT
class LFU:
    def __init__(self, capacity: int):
        self.capacity = capacity  # Số lượng phần tử tối đa trong cache
        self.data = {}  # Lưu (key -> (value, frequency))
        self.freq_map = defaultdict(set)  # Nhóm key theo frequency
        self.min_freq = 0  # Theo dõi tần suất nhỏ nhất trong cache
    
    def _update_freq(self, key):
        """Cập nhật tần suất truy cập của key"""
        value, freq = self.data[key]
        self.freq_map[freq].remove(key)  # Xóa key khỏi nhóm cũ

        if not self.freq_map[freq]:  # Nếu nhóm trống, xóa nó
            del self.freq_map[freq]
            if freq == self.min_freq:  # Cập nhật min_freq nếu cần
                self.min_freq += 1

        new_freq = freq + 1
        self.data[key] = (value, new_freq)  # Cập nhật frequency
        self.freq_map[new_freq].add(key)  # Thêm vào nhóm mới

    def get(self, key: int) -> int:
        """Lấy giá trị của key, đồng thời cập nhật frequency"""
        if key not in self.data:
            return -1  # Không tìm thấy

        self._update_freq(key)  # Tăng tần suất truy cập
        return self.data[key][0]  # Trả về giá trị

    def put(self, key: int, value: int):
        """Thêm hoặc cập nhật giá trị trong cache"""
        if self.capacity == 0:
            return -1
        
        if key in self.data:
            self.data[key] = (value, self.data[key][1])  # Cập nhật giá trị
            self._update_freq(key)  # Cập nhật tần suất truy cập
            return -1
        
        mem = -1
        if len(self.data) >= self.capacity:
            # Xóa phần tử ít được truy cập nhất
            lfu_key = next(iter(self.freq_map[self.min_freq]))  # Lấy key đầu tiên
            del self.data[lfu_key]
            self.freq_map[self.min_freq].remove(lfu_key)
            if not self.freq_map[self.min_freq]:  # Cập nhật min_freq
                del self.freq_map[self.min_freq]
            mem = lfu_key

        # Thêm key mới với tần suất = 1
        self.data[key] = (value, 1)
        self.freq_map[1].add(key)
        self.min_freq = 1  # Reset min_freq về 1

        return mem